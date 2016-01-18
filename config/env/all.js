'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

var gruppen = {
  informatik: {
    id: 'informatik',
    name: 'Normal',
    kurs: 'Informatik',
    mail: ''
  }
};
var kurse = {
  informatikVorkurs: {
    name: 'Vorkurs Informatik',
    id: 'informatikVorkurs',
    info: 'Dieser zweiwöchige Kurs richtet sich an Studierende, die im Sommersemester 2016 das Studium der Informatik, Mathematik, Wirtschaftsinformatik, Informations- und Systemtechnik oder eines verwandten Faches an der Technischen Universität' +
    ' Braunschweig aufnehmen. Anhand von Beispielen sollen die Grundlagen, Methoden und Denk- und Arbeitsweisen der Informatik vermittelt werden. Außerdem wird der Umgang mit einem Unix-Betriebssystem und Werkzeugen zur Programmierung geübt. Hierfür wird die eigens entwickelte Nutshell verwendet. Dabei können von den Teilnehmern auch kleine Java-Programme erstellt werden. Die Teilnahme am Vorkurs ist nicht Voraussetzung für ein erfolgreiches Studium, aber erfahrungsgemäß fällt Studierenden, die den Vorkurs besucht haben, der Einstieg ins' +
    ' Studium leichter. Der Vorkurs Beginnt am Montag, den 21 März 2016, um 9:45 im Hörsaal IZ (Informatik Zentrum) 161.',
    email: 'Dieser zweiwöchige Kurs richtet sich an Studierende, die im Sommersemester 2016 das Studium der Informatik, Mathematik, Wirtschaftsinformatik, Informations- und Systemtechnik oder eines verwandten Faches an der Technischen Universität' +
    ' Braunschweig aufnehmen. <br>\n<br>\n Anhand von Beispielen sollen die Grundlagen, Methoden und Denk- und Arbeitsweisen der Informatik vermittelt werden. Außerdem wird der Umgang mit einem Unix-Betriebssystem und Werkzeugen zur Programmierung geübt. Hierfür wird die eigens entwickelte Nutshell <a hidden="https://tubs-ips.github.io/nutsh-vorkurs/">https://tubs-ips.github.io/nutsh-vorkurs/</a> verwendet. Dabei können von den Teilnehmern auch kleine Java-Programme erstellt werden.<br>\n<br>\n Die Teilnahme am Vorkurs ist nicht Voraussetzung für ein erfolgreiches Studium, aber erfahrungsgemäß fällt Studierenden, die den Vorkurs besucht haben, der Einstieg ins' +
    ' Studium leichter. Der Vorkurs Beginnt am Montag, den 21 März 2016, um 9:45 im Hörsaal IZ (Informatik Zentrum) 161. Bitte bringen Sie eigenes Schreibmaterial sowie wenn vorhanden einen Laptop mit.',
    gruppen: [
      [gruppen.informatik]
    ]
  }
};

module.exports = {
  root: rootPath,
  http: {
    port: process.env.PORT || 3000
  },
  https: {
    port: false,

    // Paths to key and cert as string
    ssl: {
      key: '',
      cert: '',
      ca: ''
    }
  },
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,
  templateEngine: 'swig',

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },
  public: {
    languages: [{
      locale: 'de',
      direction: 'ltr'
    }],
    currentLanguage: 'de',
    loginPage: '/auth/login',
    cssFramework: 'bootstrap',
    vorkursConfig: {
      sex: {
        frau: 'Frau',
        herr: 'Herr',
        ka: 'keine Angabe'
      },
      name: 'vorkurs',
      semester: 'Sommersemester 2016',
      anmeldungStart: '1.2.2016',
      anmeldungEnde: '16.3.2016',
      emailEnc: 'aGl3aXNAaXBzLmNzLnR1LWJzLmRl',
      studiengang: ['Architektur', 'Bauingenieurwesen', 'Bio-, Chemie- und Pharmaingenieurwesen', 'Biologie', 'Biologie und ihre Vermittlung', 'Biotechnologie', 'Chemie', 'Chemie und ihre Vermittlung', 'Computer und Elektronik', 'Darstellendes Spiel', 'Deutsch: Germanistik', 'Elektrotechnik', 'Energietechnik', 'Energie- und Verfahrenstechnik/Bioverfahrenstechnik', 'English Studies', 'Erziehungswissenschaft', 'Evangelische Theologie', 'Finanz- und Wirtschaftsmathematik', 'Germanistik', 'Geschichte', 'Informatik', 'Informations-Systemtechnik', 'Integrierte Sozialwissenschaften', 'Kommunikationstechnik', 'Kraftfahrzeugtechnik', 'KUNST.Lehramt  Hochschule für Bildene Künste', 'Kunstwissenschaft', 'Lebensmittelchemie', 'Lehramt als Studienziel', 'Luft- und Raumfahrttechnik', 'Maschinenbau', 'Materialwissenschaften', 'Mathematik', 'Mathematik', 'Mathematik und ihre Vermittlung', 'Mechatronik', 'Mechatronik und Messtechnik', 'Medienwissenschaften', 'Medizinische Informatik', 'Mobilität und Verkehr', 'Musikpädagogik', 'Nano-Systems-Engineering', 'Pharmazie', 'Philosophie', 'Physik', 'Physik', 'Physik und ihre Vermittlung', 'Politik siehe Integrierte Sozialwissenschaften', 'Produktions- und Systemtechnik', 'Psychologie', 'Sozialwissenschaften, Integrierte', 'Sport/Bewegungspädagogik', 'Umweltingenieurwesen', 'Umweltnaturwissenschaften', 'Wirtschaftsinformatik', 'Wirtschaftsingenieurwesen Bauingenieurwesen', 'Wirtschaftsingenieurwesen Elektrotechnik', 'Wirtschaftsingenieurwesen Maschinenbau'],
      kurse: kurse,
      gruppen: gruppen
    }
  },
  // The session cookie name
  sessionName: 'connect.sid',
  // Set bodyParser options
  bodyParser: {
    json: {limit: '100kb'},
    urlencoded: {limit: '100kb', extended: true}
  }
};
