import type { Contract } from '../types/contract';
import type { SatSection, SatStep, SatTestRun } from '../types/sat';

const SITE_CODES = ['per', 'rjo', 'dqx', 'spo', 'cps', 'bho', 'cwb', 'poa', 'rec', 'for', 'ssa', 'bsb'];
const CLIENT_TOKENS = ['safran', 'imbarie', 'aurora', 'nexus', 'vertix', 'lumen', 'orion', 'delta', 'cobalt', 'helix'];
const OPERATOR = 'noc.n1';

function makeRng(seedText: string): () => number {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i += 1) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let state = h >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Generated = {
  op: string;
  peName: string;
  swName: string;
  cpeName: string;
  station: string;
  clientToken: string;
  vlan: number;
  peIface: string;
  peIp: string;
  cpeWanIp: string;
  lanNet: string;
  wanIface: string;
  lanIface: string;
  vrf: string;
  mac: string;
  bandwidth: number;
  download: string;
  upload: string;
  lossPct: number;
  peUptime: string;
  swUptime: string;
  cpeUptime: string;
};

function parseBandwidth(productName: string): number {
  const match = productName.match(/(\d+)\s*mbps/i);
  if (match) return Number(match[1]);
  return 100;
}

function generate(contract: Contract): Generated {
  const rng = makeRng(contract.circuit);
  const pick = <T>(list: T[]): T => list[Math.floor(rng() * list.length)];
  const num = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  const hex4 = () => Math.floor(rng() * 0x10000).toString(16).padStart(4, '0');

  const siteA = pick(SITE_CODES);
  const siteB = pick(SITE_CODES);
  const clientToken = pick(CLIENT_TOKENS);
  const station = pick(CLIENT_TOKENS);
  const vlan = num(1000, 1999);
  const a = num(64, 127);
  const b = num(0, 60);
  const host = num(1, 60) * 4 + 2;
  const peIp = `100.${a}.${b}.${host}/30`;
  const cpeWanIp = `100.${a}.${b}.${host - 1}`;
  const bandwidth = parseBandwidth(contract.productName);
  const downloadValue = (bandwidth * (0.25 + rng() * 0.45)).toFixed(2);
  const uploadValue = (bandwidth * (0.01 + rng() * 0.08)).toFixed(2);

  return {
    op: OPERATOR,
    peName: `c-bb-${siteA}-${siteB}-${num(100, 899)}-mx480-01-re${num(0, 1)}`,
    swName: `a-me-sw-${siteB}-00${num(1, 9)}-${station}-01`,
    cpeName: `cl-rt-${siteB}-${clientToken}-01`,
    station,
    clientToken,
    vlan,
    peIface: `xe-0/0/${num(0, 7)}.${vlan}`,
    peIp,
    cpeWanIp,
    lanNet: `192.168.${num(0, 254)}.0`,
    wanIface: `GigabitEthernet2.${vlan}`,
    lanIface: `Vlan${vlan}`,
    vrf: `VPN-${vlan}`,
    mac: `${hex4()}.${hex4()}.${hex4()}`,
    bandwidth,
    download: downloadValue,
    upload: uploadValue,
    lossPct: num(8, 34),
    peUptime: `${num(2, 60)} days ${num(0, 23)} hours ${num(0, 59)} minutes`,
    swUptime: `${num(2, 90)} days ${num(0, 23)} hours ${num(0, 59)} minutes ${num(0, 59)} seconds`,
    cpeUptime: `${num(1, 30)} weeks, ${num(0, 6)} days, ${num(0, 23)} hours, ${num(0, 59)} minutes`,
  };
}

function j(lines: string[]): string {
  return lines.join('\n');
}

function step(procedure: string, result: string, log: string): SatStep {
  return { procedure, result, status: 'pass', log };
}

function buildPeSteps(g: Generated): SatStep[] {
  return [
    step(
      'Acessou Equipamento',
      `Conectou no PE = '${g.peName}'`,
      j([
        `login as: ${g.op}`,
        `${g.op}@${g.peName}'s password:`,
        '--- JUNOS 18.4R3-S9 built 2023-11-02 ---',
        `${g.op}@${g.peName}>`,
        'Sessão estabelecida com sucesso.',
      ]),
    ),
    step(
      'Localizar interface do circuito',
      `Interface foi localizada (${g.peIface})`,
      j([
        `${g.op}@${g.peName}> show configuration interfaces | match ${g.vlan}`,
        `xe-0/0/${g.peIface.split('/')[2].split('.')[0]} {`,
        `    unit ${g.vlan} {`,
        `        vlan-id ${g.vlan};`,
        `        family inet { address ${g.peIp}; }`,
        '    }',
        '}',
      ]),
    ),
    step(
      'Check Configuração da Interface',
      `IP está configurado na interface de acesso(${g.peIp})`,
      j([
        `${g.op}@${g.peName}> show interfaces ${g.peIface} terse`,
        'Interface               Admin Link Proto    Local',
        `${g.peIface}        up    up   inet     ${g.peIp}`,
      ]),
    ),
    step(
      'Check de conectividade PE CPE',
      'Existe conexão entre o PE - CPE',
      j([
        `${g.op}@${g.peName}> ping ${g.cpeWanIp} rapid count 5`,
        `PING ${g.cpeWanIp} : 56 data bytes`,
        '!!!!!',
        '5 packets transmitted, 5 packets received, 0% packet loss',
        'round-trip min/avg/max = 1.214/1.682/2.391 ms',
      ]),
    ),
    step(
      'Validação do campo LAN',
      'Rota LAN configurada',
      j([
        `${g.op}@${g.peName}> show route table ${g.vrf}.inet.0 ${g.lanNet}`,
        `${g.lanNet}/24      *[BGP/170] via ${g.cpeWanIp}`,
        `                     > to ${g.cpeWanIp} via ${g.peIface}`,
      ]),
    ),
    step(
      'Verificando perda de pacote no circuito',
      'Não houve perda de pacotes',
      j([
        `${g.op}@${g.peName}> ping ${g.cpeWanIp} rapid count 100`,
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        '100 packets transmitted, 100 packets received, 0% packet loss',
      ]),
    ),
    step(
      'Identificando Banda Contratada',
      `Banda Contratada: ${g.bandwidth} Mbps`,
      j([
        `${g.op}@${g.peName}> show configuration class-of-service interfaces ${g.peIface}`,
        'shaping-rate {',
        `    ${g.bandwidth}m;`,
        '}',
      ]),
    ),
    step(
      'Identificando banda utilizada',
      `Média Download: ${g.download} Mbps | Média Upload: ${g.upload} Mbps`,
      j([
        `${g.op}@${g.peName}> monitor interface ${g.peIface}`,
        `Input  bytes:  ${g.download} Mbps (download cliente)`,
        `Output bytes:  ${g.upload} Mbps (upload cliente)`,
      ]),
    ),
  ];
}

function buildSwitchSteps(g: Generated): SatStep[] {
  return [
    step(
      'Acessou Equipamento',
      `Conectou no Switch = '${g.swName}'`,
      j([
        `login as: ${g.op}`,
        'Password:',
        `${g.swName}> enable`,
        `${g.swName}#`,
      ]),
    ),
    step(
      'Identificando interface de acesso',
      'Interface de acesso localizada (Gi1/0/24)',
      j([
        `${g.swName}#show interfaces description | include ${g.vlan}`,
        'Interface      Status   Protocol Description',
        `Gi1/0/24       up       up       CPE-${g.clientToken}-${g.vlan}`,
      ]),
    ),
    step(
      'Identificando nome da estação',
      `Estação: '${g.station}'`,
      j([
        `${g.swName}#show cdp neighbors Gi1/0/24 detail | include Device`,
        `Device ID: ${g.station}`,
      ]),
    ),
    step(
      'Verificando status da interface',
      'Interface Gi1/0/24 up/up',
      j([
        `${g.swName}#show interface Gi1/0/24 status`,
        'Port      Name    Status    Vlan   Duplex  Speed Type',
        `Gi1/0/24          connected ${g.vlan}   a-full a-1000 10/100/1000BaseTX`,
      ]),
    ),
    step(
      'Verificando tabela MAC',
      `MAC Address aprendido: ${g.mac}`,
      j([
        `${g.swName}#show mac address-table interface Gi1/0/24`,
        '          Mac Address Table',
        'Vlan    Mac Address       Type        Ports',
        '----    -----------       --------    -----',
        `${g.vlan}    ${g.mac}    DYNAMIC     Gi1/0/24`,
      ]),
    ),
    step(
      'Verificando taxa de erro da interface',
      'Sem taxa de erro na interface',
      j([
        `${g.swName}#show interface Gi1/0/24 counters errors`,
        'Port       Align-Err  FCS-Err  Xmit-Err  Rcv-Err',
        'Gi1/0/24           0        0         0        0',
      ]),
    ),
    step(
      'Verificar Uptime da Switch',
      `Uptime: ${g.swUptime}`,
      j([
        `${g.swName}#show version | include uptime`,
        `${g.swName} uptime is ${g.swUptime}`,
      ]),
    ),
  ];
}

function buildCpeSteps(g: Generated): SatStep[] {
  const steps = [
    step(
      'Acessou Equipamento',
      `Conectou no CPE = '${g.cpeName}'`,
      j([
        `login as: ${g.op}`,
        'Password:',
        `${g.cpeName}> enable`,
        `${g.cpeName}#`,
      ]),
    ),
    step(
      'Identificar interface LAN | WAN',
      `Interfaces localizadas. WAN e LAN respectivamente. WAN: '${g.wanIface}' | LAN: '${g.lanIface}'`,
      j([
        `${g.cpeName}#show ip interface brief | exclude unassigned`,
        'Interface                  IP-Address      Status  Protocol',
        `${g.wanIface}      ${g.cpeWanIp}   up      up`,
        `${g.lanIface}                 192.168.${g.vlan % 254}.1   up      up`,
      ]),
    ),
    step(
      'Identificando VRF',
      `VRF Existente '${g.vrf}'`,
      j([
        `${g.cpeName}#show vrf | include ${g.vlan}`,
        `  ${g.vrf}                        ${g.wanIface}`,
      ]),
    ),
    step(
      'Identificando Speed, Duplex e taxa de erro WAN',
      "A interface não taxou erro. Duplex e Speed 'Full Duplex, 1Gbps'",
      j([
        `${g.cpeName}#show interface ${g.wanIface} | include duplex|error`,
        '  Full Duplex, 1Gbps, link type is auto',
        '  0 input errors, 0 CRC, 0 frame, 0 output errors',
      ]),
    ),
    step(
      'Identificando Speed, Duplex e taxa de erro LAN',
      "A interface não taxou erro. Duplex e Speed 'Full-duplex, 1000Mb/s'",
      j([
        `${g.cpeName}#show interface ${g.lanIface} | include duplex|error`,
        '  Full-duplex, 1000Mb/s, media type is RJ45',
        '  0 input errors, 0 CRC, 0 frame, 0 output errors',
      ]),
    ),
    step(
      'Validando conectividade LAN com a internet',
      'Não houve falhas de conectividade',
      j([
        `${g.cpeName}#ping vrf ${g.vrf} 8.8.8.8 source ${g.lanIface} repeat 10`,
        'Sending 10, 100-byte ICMP Echos to 8.8.8.8',
        '!!!!!!!!!!',
        'Success rate is 100 percent (10/10), round-trip min/avg/max = 8/12/19 ms',
      ]),
    ),
    step(
      'Validando tabela ARP',
      `ARP aprendido pela rede do Cliente '${g.mac}'`,
      j([
        `${g.cpeName}#show ip arp vrf ${g.vrf} | include ${g.lanIface}`,
        'Protocol  Address          Age   Hardware Addr   Type   Interface',
        `Internet  192.168.${g.vlan % 254}.10     12    ${g.mac}  ARPA   ${g.lanIface}`,
      ]),
    ),
    step(
      'Verificar Uptime',
      `Uptime: ${g.cpeUptime}`,
      j([
        `${g.cpeName}#show version | include uptime`,
        `${g.cpeName} uptime is ${g.cpeUptime}`,
      ]),
    ),
    step('Realizando Tracert', '', ''),
  ];
  const tracert = steps[8];
  tracert.status = 'skipped';
  tracert.log = 'Etapa não executada. Tracert acionado apenas em cenários de falha de conectividade.';
  return steps;
}

function skip(section: SatSection, indices: number[]): void {
  for (const index of indices) {
    const target = section.steps[index];
    if (!target) continue;
    target.status = 'skipped';
    target.result = '';
    target.log = 'Etapa não executada porque uma etapa anterior falhou.';
  }
}

function fail(section: SatSection, index: number, result: string, log: string): void {
  const target = section.steps[index];
  if (!target) return;
  target.status = 'fail';
  target.result = result;
  target.log = log;
}

function applyScenario(
  sections: { pe: SatSection; sw: SatSection; cpe: SatSection },
  code: string | null,
  g: Generated,
): string | null {
  const { pe, sw, cpe } = sections;

  switch (code) {
    case 'INTERMITTENT_PACKET_LOSS':
      fail(
        pe,
        5,
        `Perda de pacotes identificada no circuito (${g.lossPct}%)`,
        j([
          `${g.op}@${g.peName}> ping ${g.cpeWanIp} rapid count 100`,
          '!!!!!!!!!.!!!!!.!!!!!!!!.!!!!!!.!!!!!.!!!!!!!!!!!!.!!!!.!!!!!',
          `100 packets transmitted, ${100 - g.lossPct} packets received, ${g.lossPct}% packet loss`,
        ]),
      );
      return `Perda de pacotes intermitente identificada no circuito (${g.lossPct}% de perda no PE).`;

    case 'SWITCH_NOT_LEARNING_MAC':
      fail(
        sw,
        4,
        'MAC Address do CPE não foi aprendido',
        j([
          `${g.swName}#show mac address-table interface Gi1/0/24`,
          '          Mac Address Table',
          'Vlan    Mac Address       Type        Ports',
          '----    -----------       --------    -----',
          '% Nenhum MAC Address dinâmico aprendido nesta interface.',
        ]),
      );
      skip(sw, [5]);
      return 'Switch de acesso não aprende o MAC Address do CPE. Abertura de OS necessária.';

    case 'CPE_PACKET_LOSS':
      fail(
        cpe,
        5,
        'Perda de pacotes na conectividade LAN com a internet',
        j([
          `${g.cpeName}#ping vrf ${g.vrf} 8.8.8.8 source ${g.lanIface} repeat 10`,
          'Sending 10, 100-byte ICMP Echos to 8.8.8.8',
          '!!..!.!..!',
          'Success rate is 50 percent (5/10), round-trip min/avg/max = 9/41/120 ms',
        ]),
      );
      cpe.steps[8].status = 'fail';
      cpe.steps[8].result = 'Perda de pacotes a partir do salto do cliente';
      cpe.steps[8].log = j([
        `${g.cpeName}#traceroute vrf ${g.vrf} 8.8.8.8`,
        `  1  ${g.cpeWanIp}  2 ms  1 ms  2 ms`,
        '  2  * * *',
        '  3  * * *  (perda de pacotes a partir deste salto)',
      ]);
      return 'Perda de pacotes na conectividade LAN do CPE com a internet.';

    case 'NO_MANAGEMENT':
      fail(
        pe,
        0,
        'Não foi possível acessar o equipamento (sem gerência)',
        j([
          `login as: ${g.op}`,
          `${g.op}@${g.peName}'s password:`,
          'ssh: connect to host timed out',
          'Connection timed out.',
        ]),
      );
      skip(pe, [1, 2, 3, 4, 5, 6, 7]);
      fail(
        sw,
        0,
        'Não foi possível acessar o equipamento (sem gerência)',
        j([
          `login as: ${g.op}`,
          'ssh: connect to host timed out',
          'Connection timed out.',
        ]),
      );
      skip(sw, [1, 2, 3, 4, 5, 6]);
      fail(
        cpe,
        0,
        'Não foi possível acessar o equipamento (sem gerência)',
        j([
          `login as: ${g.op}`,
          'ssh: connect to host timed out',
          'Connection timed out.',
        ]),
      );
      skip(cpe, [1, 2, 3, 4, 5, 6, 7, 8]);
      return 'Sem acesso de gerência aos equipamentos do circuito. Abertura de OS necessária.';

    case 'LINK_INOPERANTE_ALGAR':
      fail(
        pe,
        3,
        'Não há conexão entre o PE - CPE',
        j([
          `${g.op}@${g.peName}> ping ${g.cpeWanIp} rapid count 5`,
          `PING ${g.cpeWanIp} : 56 data bytes`,
          '.....',
          '5 packets transmitted, 0 packets received, 100% packet loss',
        ]),
      );
      skip(pe, [4, 5, 6, 7]);
      fail(
        cpe,
        0,
        'Não foi possível acessar o equipamento (CPE inalcançável)',
        j([
          `login as: ${g.op}`,
          'ssh: connect to host timed out',
          'Connection timed out.',
        ]),
      );
      skip(cpe, [1, 2, 3, 4, 5, 6, 7, 8]);
      return 'Link inoperante: sem conectividade entre o PE e o CPE.';

    default:
      return null;
  }
}

export function runSatTest(contract: Contract): SatTestRun {
  const g = generate(contract);
  const pe: SatSection = { device: 'PE', title: 'Resultados do PE', deviceName: g.peName, steps: buildPeSteps(g) };
  const sw: SatSection = { device: 'Switch', title: 'Resultados do Switch', deviceName: g.swName, steps: buildSwitchSteps(g) };
  const cpe: SatSection = { device: 'CPE', title: 'Resultados do CPE', deviceName: g.cpeName, steps: buildCpeSteps(g) };

  const code = contract.satTestProfile.predefinedResult;
  const failureMessage = applyScenario({ pe, sw, cpe }, code, g);

  return {
    hasFailure: failureMessage !== null,
    failureMessage,
    sections: [pe, sw, cpe],
  };
}
