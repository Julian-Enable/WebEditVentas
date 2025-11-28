// Sistema de detección de banco emisor basado en BIN (Bank Identification Number)
// Los primeros 6-8 dígitos de una tarjeta identifican el banco emisor

interface BankInfo {
  bankName: string;
  cardBrand: string;
  country: string;
}

// Base de datos de BINs de bancos colombianos principales
const colombianBanks: Record<string, BankInfo> = {
  // Bancolombia - Visa (Ampliado)
  '450425': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '450426': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '450427': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '450428': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '450995': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '450996': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451091': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451092': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451770': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451771': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451772': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451773': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451774': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451775': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451776': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451777': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451778': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451779': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451780': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '451781': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '476046': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '476047': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '476048': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '476049': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '489412': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '489413': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '489414': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  '489415': { bankName: 'Bancolombia', cardBrand: 'Visa', country: 'CO' },
  
  // Bancolombia - Mastercard (Muy Ampliado)
  '542313': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '542314': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '542315': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '542316': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '542317': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549130': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549131': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549132': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549133': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549134': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549135': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '522096': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '522097': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '522098': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '522099': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '522100': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '522101': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552382': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552383': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552384': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552385': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552386': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552387': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530005': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530006': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530007': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530008': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530009': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530010': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530691': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530692': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530693': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530694': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '530695': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552745': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552746': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552747': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552748': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552749': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '552750': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549751': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549752': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '549753': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '517805': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '517806': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },
  '517807': { bankName: 'Bancolombia', cardBrand: 'Mastercard', country: 'CO' },

  // Davivienda - Visa (COMPLETO)
  '469486': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '469487': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '469488': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '469489': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '469490': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451848': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451849': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451850': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451851': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451852': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451853': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451854': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '451855': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476664': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476665': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476666': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476667': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476668': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476669': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '476670': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '410120': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '410121': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '410122': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '410123': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '484393': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '484394': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '484395': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '489453': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '489454': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  '489455': { bankName: 'Davivienda', cardBrand: 'Visa', country: 'CO' },
  
  // Davivienda - Mastercard (COMPLETO)
  '549592': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '549593': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '549594': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '549595': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '549596': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '549597': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '549598': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '517562': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '517563': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '517564': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '517565': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '517566': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '517567': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530031': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530033': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530035': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530040': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530041': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530042': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '530043': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '543085': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '543086': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '543087': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '552224': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '552225': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },
  '552226': { bankName: 'Davivienda', cardBrand: 'Mastercard', country: 'CO' },

  // Banco de Bogotá - Visa (COMPLETO)
  '405184': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '405185': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '405186': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '405187': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '425352': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '425353': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '425354': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '425355': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '446738': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '446739': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '446740': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '446741': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '446742': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '477174': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '477175': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '477176': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '477177': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '477178': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '477179': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '405188': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  '405189': { bankName: 'Banco de Bogotá', cardBrand: 'Visa', country: 'CO' },
  
  // Banco de Bogotá - Mastercard (COMPLETO)
  '542815': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '542816': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '542817': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '542818': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '542819': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '546460': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '546461': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '546462': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '546463': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '546464': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '546465': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '517566': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '517567': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '530044': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '530045': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },
  '530046': { bankName: 'Banco de Bogotá', cardBrand: 'Mastercard', country: 'CO' },

  // BBVA Colombia - Visa (COMPLETO)
  '405369': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '405370': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '405371': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '405372': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '452638': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '452639': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '452640': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '452641': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '452642': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '476132': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '476133': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '476134': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '476135': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '476136': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '476137': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '440921': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '440922': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  '440923': { bankName: 'BBVA Colombia', cardBrand: 'Visa', country: 'CO' },
  
  // BBVA Colombia - Mastercard (COMPLETO)
  '517916': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '517917': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '517918': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '517919': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '543357': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '543358': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '543359': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '543360': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '543361': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '543362': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '552660': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '552661': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },
  '552662': { bankName: 'BBVA Colombia', cardBrand: 'Mastercard', country: 'CO' },

  // Banco AV Villas - Visa (COMPLETO)
  '402751': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '402752': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '402753': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '402754': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '451881': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '451882': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '477835': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '477836': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '477837': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '477838': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '477839': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '477840': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '489393': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  '489394': { bankName: 'Banco AV Villas', cardBrand: 'Visa', country: 'CO' },
  
  // Banco AV Villas - Mastercard (COMPLETO)
  '530085': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '530086': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '530087': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '530088': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '530089': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '543365': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '543366': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },
  '549563': { bankName: 'Banco AV Villas', cardBrand: 'Mastercard', country: 'CO' },

  // Banco Popular - Visa (COMPLETO)
  '451879': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '451880': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '477180': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '477181': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '477182': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '477183': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '489435': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  '489436': { bankName: 'Banco Popular', cardBrand: 'Visa', country: 'CO' },
  
  // Banco Popular - Mastercard (COMPLETO)
  '549564': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },
  '549565': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },
  '549566': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },
  '549567': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },
  '549568': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },
  '547967': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },
  '547968': { bankName: 'Banco Popular', cardBrand: 'Mastercard', country: 'CO' },

  // Scotiabank Colpatria - Visa (COMPLETO)
  '499852': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '499853': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '499854': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '499855': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '451844': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '451845': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '451846': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '451847': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '477184': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  '477185': { bankName: 'Scotiabank Colpatria', cardBrand: 'Visa', country: 'CO' },
  
  // Scotiabank Colpatria - Mastercard (COMPLETO)
  '549631': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '549632': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '549633': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '549634': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '527688': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '527689': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '527690': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '527691': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '527692': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '552230': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },
  '552231': { bankName: 'Scotiabank Colpatria', cardBrand: 'Mastercard', country: 'CO' },

  // Banco de Occidente - Visa (COMPLETO)
  '411221': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '411222': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '411223': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '411224': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '451883': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '451884': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '451885': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '451886': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '489456': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  '489457': { bankName: 'Banco de Occidente', cardBrand: 'Visa', country: 'CO' },
  
  // Banco de Occidente - Mastercard (COMPLETO)
  '543396': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },
  '543397': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },
  '543398': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },
  '543399': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },
  '543400': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },
  '549599': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },
  '549600': { bankName: 'Banco de Occidente', cardBrand: 'Mastercard', country: 'CO' },

  // Banco Caja Social - Visa (COMPLETO)
  '451895': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '451896': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '451897': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '489539': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '489540': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '489541': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '489542': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '489543': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  '477186': { bankName: 'Banco Caja Social', cardBrand: 'Visa', country: 'CO' },
  
  // Banco Caja Social - Mastercard (COMPLETO)
  '530034': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },
  '530036': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },
  '530037': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },
  '530047': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },
  '530048': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },
  '552237': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },
  '552238': { bankName: 'Banco Caja Social', cardBrand: 'Mastercard', country: 'CO' },

  // Banco Agrario - Visa (COMPLETO)
  '477860': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  '477861': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  '477862': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  '477863': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  '477864': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  '451893': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  '451894': { bankName: 'Banco Agrario', cardBrand: 'Visa', country: 'CO' },
  
  // Banco Agrario - Mastercard (COMPLETO)
  '530032': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },
  '530038': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },
  '530039': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },
  '530049': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },
  '530050': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },
  '549635': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },
  '549636': { bankName: 'Banco Agrario', cardBrand: 'Mastercard', country: 'CO' },

  // Banco Falabella
  '483194': { bankName: 'Banco Falabella', cardBrand: 'Visa', country: 'CO' },
  '524257': { bankName: 'Banco Falabella', cardBrand: 'Mastercard', country: 'CO' },

  // Nequi (Bancolombia)
  '558848': { bankName: 'Nequi', cardBrand: 'Mastercard', country: 'CO' },
  '523018': { bankName: 'Nequi', cardBrand: 'Mastercard', country: 'CO' },

  // Daviplata
  '522025': { bankName: 'Daviplata', cardBrand: 'Mastercard', country: 'CO' },

  // American Express Colombia
  '377762': { bankName: 'American Express', cardBrand: 'American Express', country: 'CO' },
  '376414': { bankName: 'American Express', cardBrand: 'American Express', country: 'CO' },

  // Diners Club Colombia
  '36': { bankName: 'Diners Club', cardBrand: 'Diners Club', country: 'CO' },
};

/**
 * Detecta el banco emisor basándose en el BIN de la tarjeta
 * @param cardNumber - Número de tarjeta (puede incluir espacios)
 * @returns Información del banco o null si no se encuentra
 */
export const detectBank = (cardNumber: string): BankInfo | null => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (cleanNumber.length < 6) {
    return null;
  }

  // Buscar coincidencia exacta con 6 dígitos
  const bin6 = cleanNumber.substring(0, 6);
  if (colombianBanks[bin6]) {
    return colombianBanks[bin6];
  }

  // Buscar con 8 dígitos si está disponible
  if (cleanNumber.length >= 8) {
    const bin8 = cleanNumber.substring(0, 8);
    if (colombianBanks[bin8]) {
      return colombianBanks[bin8];
    }
  }

  // Buscar con 4 dígitos (menos preciso pero útil)
  const bin4 = cleanNumber.substring(0, 4);
  if (colombianBanks[bin4]) {
    return colombianBanks[bin4];
  }

  // Buscar con 2 dígitos (para Diners, Amex)
  const bin2 = cleanNumber.substring(0, 2);
  if (colombianBanks[bin2]) {
    return colombianBanks[bin2];
  }

  return null;
};

/**
 * Obtiene el nombre completo de la tarjeta (Banco + Tipo)
 * Ejemplo: "Bancolombia Visa", "Davivienda Mastercard"
 */
export const getFullCardName = (cardNumber: string): string => {
  const bankInfo = detectBank(cardNumber);
  
  if (!bankInfo) {
    return 'Tarjeta';
  }

  return `${bankInfo.bankName} ${bankInfo.cardBrand}`;
};

/**
 * Verifica si la tarjeta es de un banco específico
 */
export const isBankCard = (cardNumber: string, bankName: string): boolean => {
  const bankInfo = detectBank(cardNumber);
  return bankInfo?.bankName.toLowerCase().includes(bankName.toLowerCase()) || false;
};

/**
 * Obtiene solo el nombre del banco
 */
export const getBankName = (cardNumber: string): string | null => {
  const bankInfo = detectBank(cardNumber);
  return bankInfo?.bankName || null;
};
