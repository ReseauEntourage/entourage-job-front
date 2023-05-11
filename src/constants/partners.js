const sortByTitleOrKey = (a, b) => {
  const titleOrKeyA = a.title || a.key;
  const titleOrKeyB = b.title || b.key;
  return titleOrKeyA.localeCompare(titleOrKeyB);
};

const STRATEGY = [
  {
    key: 'pic',
    bis: true,
    title:
      'L’appel à projets « 100 % Inclusion – La fabrique de la remobilisation » du Plan d’investissement dans les compétences',
    desc:
      'Pour accompagner la transformation du système de formation portée par la loi pour la liberté de choisir son avenir professionnel et construire une société de compétences inclusive et compétitive, le plan d’investissement dans les compétences soutient l’expérimentation dans le domaine de la montée en compétences, de la valorisation des compétences et de l’accès à l’emploi durable.\n\n' +
      'L’appel à projets « 100 % Inclusion – La fabrique de la remobilisation » vise à expérimenter des parcours intégrés, allant du repérage et de la remobilisation à l’emploi ou à l’activité durable, pour les publics qui en sont les plus éloignés\xa0: jeunes et demandeurs d’emplois peu ou pas qualifiés, habitant les quartiers de la politique de la ville, les territoires d’outre-mer ou des zones rurales enclavées, en particulier.',
    answer:
      '100 % inclusion, c’est un mot d’ordre au cœur de la politique du Gouvernement car nul n’est inemployable et nous devons accompagner les plus vulnérables dans la formation et l’accès à l’emploi. La France regorge sur notre territoire d’entrepreneurs sociaux, d’initiatives innovantes et de compétences, qui doivent permettre d’apporter des solutions à nos concitoyens.',
    author: {
      name: 'Muriel Pénicaud',
      status: 'ministre du Travail',
    },
    link: 'https://travail-emploi.gouv.fr/le-ministere-en-action/pic/',
  },
  {
    key: 'archipel',
    title: 'Archipel & Co',
    desc: "Partenaires d'entreprises, d'ONG, d'institutions publiques et d'entrepreneurs sociaux, ils font émerger de nouvelles façons de voir la société et d'agir pour la transformer.",
    answer:
      "Au croisement des questions sociétales et des enjeux commerciaux et financiers de nos clients, il est nécessaire d'inventer les solutions d'une transition juste : elles doivent être performantes économiquement et socialement souhaitables. Nous les cherchons, les dessinons, les fabriquons, les accélérons, les rendons vivantes. Cela s'appelle l'impact. Parfois infime, toujours important.",
    link: 'https://archipel-co.com/',
  },
  {
    key: 'advens',
    title: 'Advens',
    desc: 'Advens est le 1er pure player français de la cybersécurité et accompagne les entreprises, territoires et établissements publics pour les aider à prendre de l’avance et faire de la sécurité un actif différenciateur\xa0!',
    question:
      'Comment décrire le partenariat, la collaboration entre votre structure et LinkedOut\xa0?',
    answer:
      'Avec la Course Au Changement, nous avons tissé des liens très forts et étroits entre nos organisations et nos équipes.\n\n' +
      'Nous sommes très heureux de contribuer au développement de LinkedOut, à la lutte contre la grande exclusion en France et, nous le souhaitons, au retour à l’emploi de milliers de personnes qui le méritent tant.',
    link: 'https://www.advens.fr/fr/',
  },
  {
    key: 'tbwa',
    title: 'TBWA',
    desc:
      'TBWA\\, The Disruption® Company, fait partie du réseau international TBWA\\ Worldwide implanté dans 95 pays avec 275 agences.\n\n' +
      "En France, TBWA\\, 1100 collaborateurs, est le 3ème groupe de communication globale et est la seule agence élue 4 fois de suite Agence de l'Année aux Cannes Lions.",
    question: 'Quel est, pour vous, la force de LinkedOut\xa0?',
    answer:
      'Permettre en 1 clic de partager son réseau professionnel et personnel à ceux qui n’en ont pas et qui en ont cruellement besoin.',
    link: 'https://www.tbwa-paris.com/fr',
  },
  {
    key: 'randstad',
    title: 'Institut Randstad',
    desc: 'L’Institut Randstad est le laboratoire de l’innovation sociale du Groupe Randstad, pour le retour durable à l’emploi. Il soutient et co–construit avec ses partenaires, des programmes pour accompagner vers l’emploi, les publics fragilisés des territoires vulnérables en France.',
    question: 'Quelle est l’expertise que vous apportez au projet\xa0?',
    answer:
      'Randstad apporte son expertise RH et sa parfaite connaissance des bassins d’emploi, pour structurer et sécuriser les parcours des candidats LinkedOut vers l’emploi durable\xa0: de l’accueil  à l’intégration et de l’accompagnement au maintien en emploi.',
    link: 'https://www.grouperandstad.fr/institut/',
  },
  {
    key: 'ares',
    title: 'Ares',
    desc: 'Ares est un groupe de structures d’insertion par l’activité économique. Ares propose à des personnes en situation d’exclusion, un travail et un accompagnement individualisé afin d’aider la personne à lever les freins à l’emploi et à se réinsérer vers un emploi durable.',
    question:
      'Pourquoi avoir eu envie de vous engager aux côtés de LinkedOut\xa0?',
    answer:
      'Le projet, en plus d’être un véritable booster emploi que ce soit pour nos salariés ou pour d’autres bénéficiaires, aborde l’insertion professionnel sous un angle très innovant pour le secteur de l’insertion et pour Ares. Le côté réseaux sociaux, diffusion de masse et communication n’est aujourd’hui que peu ou pas utilisé dans les SIAE.',
    link: 'http://www.groupeares.fr/',
  },
  {
    key: 'shareit',
    title: 'Share it',
    desc: 'Share it est un accélérateur Tech for Good créé par Ashoka et des entrepreneurs convaincus que la technologie peut aider certaines organisations sociales à démultiplier leur impact. Nous codons gratuitement des solutions digitales complexes pour des associations et entreprises sociales.',
    question: 'Que représente pour vous le projet LinkedOut\xa0?',
    answer:
      'LinkedOut c’est un tremplin vers l’inclusion\xa0: pour les entreprises qui cherchent à recruter des profils variés, pour les candidats qui pourront s’épanouir dans leur travail, et pour nous toutes et tous, qui pouvons agir simplement, en partageant un CV.',
    link: 'https://share-it.io/',
  },
].sort(sortByTitleOrKey);

const YOUNG_FINANCE = [
  {
    key: 'eurazeo',
    title: 'Eurazeo',
    link: 'https://www.eurazeo.com/fr',
  },
  {
    key: 'safran',
    title: 'Fondation Safran',
    link: 'https://www.safran-group.com/fr/engagements/un-groupe-citoyen',
  },
  {
    key: 'pierrebellon',
    title: 'Fondation Pierre Bellon',
    link: 'http://fondationpierrebellon.org/fr',
  },
  {
    key: 'ratp',
    title: 'Fondation RATP',
    link: 'https://www.fondationgrouperatp.fr/',
  },
  {
    key: 'bettencourt',
    title: 'Fondation Bettencourt-Schueller',
    link: 'https://www.fondationbs.org/',
  },
].sort(sortByTitleOrKey);

const IMPORTANT_FINANCE = [
  {
    key: 'renault',
    title: 'Fondation Renault',
    link: 'https://www.renaultgroup.com/groupe/la-fondation-renault/',
  },
  {
    key: 'airliquide',
    title: 'Fondation Air Liquide',
    link: 'https://www.fondationairliquide.com/',
  },
  {
    key: 'cera',
    title: 'Fondation CERA',
    link: 'https://www.caissedepargnerhonealpes.fr/fondation-caisse-depargne-rhone-alpes',
  },
  {
    key: 'suez',
    title: 'Fondation Suez',
    link: 'https://www.suez.com/fr/notre-groupe/un-groupe-engage/la-fondation-suez',
  },
  {
    key: 'transdev',
    title: 'Fondation Transdev',
    link: 'http://www.fondation.transdev.com/',
  },
  {
    key: 'prefiledefrance',
    title: 'Préfecture Île-de-France',
    link: 'https://www.prefectures-regions.gouv.fr/ile-de-france',
  },
  {
    key: 'ringfoundation',
    title: 'Ring Foundation',
    link: 'https://www.ringcp.com/ring-foundation',
  },
  {
    key: 'swisslife',
    title: 'Swiss Life',
    link: 'https://www.swisslife.fr/',
  },
  {
    key: 'ca',
    title: 'Crédit Agricole',
    link: 'https://www.credit-agricole.com/',
  },
  {
    key: 'bnp',
    title: 'Fondation BNP Paribas',
    link: 'https://group.bnpparibas/decouvrez-le-groupe/qui-sommes-nous/fondation-bnp-paribas',
  },
  {
    key: 'entreprisedespossibles',
    title: 'Entreprise des possibles',
    link: 'https://lentreprisedespossibles.org/',
  },
  {
    key: 'ausspar',
    title: 'Ausspar',
    link: 'https://groupe-elo.com/',
  },
].sort(sortByTitleOrKey);

const MAIN_FINANCE = [...YOUNG_FINANCE, ...IMPORTANT_FINANCE].sort(
  sortByTitleOrKey
);

const ALL_FINANCE = [
  ...IMPORTANT_FINANCE,
  {
    key: 'caissedesdepots',
    title: 'Caisse des Dépôts',
    link: 'https://www.caissedesdepots.fr/',
  },
  {
    key: 'camping',
    title: 'Campings.com',
    link: 'https://www.campings.com/fr/',
  },
  {
    key: 'kleever',
    title: 'Kleever',
    link: 'https://www.kleever.com/',
  },
  {
    key: 'neoxia',
    title: 'Neoxia',
    desc: "Ensemble, créons l'Internet of People, not Things... où la complexité des technologies s'efface devant la simplicité de l'expérience\xa0!\nPur player du Numérique, NEOXIA vous accompagne pour imaginer, construire et opérer la version digitale de votre coeur de métier.",
    question: 'Qu’est-ce que l’inclusion pour vous\xa0?',
    answer:
      'Pour dire une évidence, c’est l’inverse de l’exclusion qui est un mot plus couramment utilisé et compris\xa0! Pour inclure, il faut faire parfois l’effort d’aller vers celui qui exclus. Ce n’est pas un exercice si simple que cela mais c’est super important et valorisant.',
    /*
        question: 'Que souhaitez-vous à LinkedOut\xa0?',
        answer: 'De réussir là où beaucoup échoue (ramener vers l’emploi des personnes en difficultés) et de se développer pour permettre à un maximum de personnes de revenir vers l’emploi avec l’aide de ceux qui sont près à les aider, et il y en a beaucoup\xa0!',
      */
    link: 'https://neoxia.com/',
  },
  {
    key: 'nuitdubiencommun',
    title: 'La Nuit du Bien Commun',
    link: 'https://lanuitdubiencommun.com/',
  },
  {
    key: 'accenture',
    title: 'Accenture',
    link: 'https://www.accenture.com/fr-fr',
  },
].sort(sortByTitleOrKey);

const ASSOCIATIONS = [
  {
    key: 'ares+',
    title: 'Ares +',
    desc:
      'Ares+ est un ensemble de services proposés par le groupe Ares à d’autres structures évoluant au sein de l’écosystème de l’insertion professionnelle.  Ares+ propose de mutualiser ses outils, et expertises avec des SIAE de plus petite taille (ateliers collectifs à destination des personnes en parcours, partage d’outils, prestations de conseil,…), mais a également vocation à expérimenter de nouvelles méthodes d’accompagnement, alternatives et innovantes, en lien avec d’autres acteurs de l’écosystème de l’insertion professionnelle, comme c’est le cas avec le projet LinkedOut\xa0!\n\n' +
      'Ares + propose aux candidats LinkedOut qui en ont besoin des modules pour mieux acquérir les codes professionnels et connaître le fonctionnement d’une entreprise.',
    link: 'http://www.groupeares.fr/',
  },
  {
    key: 'cravatesolidaire',
    title: 'La Cravate Solidaire',
    desc:
      "La Cravate Solidaire est une association loi 1901 positionnée en bout de chaîne de l'insertion\xa0: elle a pour objectif de lutter contre les discriminations à l'embauche, notamment celles liées à l'apparence.\n\n" +
      "Depuis 2012, l'association propose à toute personne en recherche d'emploi de participer à un atelier \"Coup de Pouce\" lors duquel les candidats sont accompagnés par un Coach en Image bénévole pour trouver une tenue professionnelle qui corresponde à leurs projets professionnels et à leurs goûts, puis s'entraînent avec des professionnels des Ressources Humaines à l’entretien d'embauche, afin de reprendre confiance en soi et mettre toutes les chances de leur côté. L'atelier se termine par la prise d'une photo de CV.\n\n" +
      "Les candidats LinkedOut qui le souhaitent seront préparés par La Cravate Solidaire aux entretiens d'embauche et recevront une tenue d’entretien, la chance\xa0!",
    link: 'http://lacravatesolidaire.org/',
  },
].sort(sortByTitleOrKey);

const ORIENTATION = [
  {
    key: 'ares',
    link: 'http://www.groupeares.fr/',
  },
  {
    key: 'repairs',
    link: 'https://www.repairs75.org/',
  },
  {
    key: 'cravatesolidaire',
    link: 'http://lacravatesolidaire.org/',
  },
  {
    key: 'vitaminet',
    link: 'http://www.groupevitaminet.com/',
  },
  {
    key: 'missionslocales',
    link: 'https://www.unml.info/',
  },
  {
    key: 'emmaus',
    link: 'https://www.emmaus-alternatives.org/',
  },
  {
    key: 'emmausequipage',
    link: 'https://emmaus-defi.org/lequipage-demmaus-defi/',
  },
  {
    key: 'apprentisauteuil',
    link: 'https://www.apprentis-auteuil.org/',
  },
  {
    key: 'poleemploi',
    link: 'https://www.pole-emploi.fr/accueil/',
  },
  {
    key: 'abej',
    link: 'https://abej-solidarite.fr/',
  },
  {
    key: 'antigel',
    link: 'https://bagageriedantigel.fr/',
  },
  {
    key: 'convergence',
    link: 'https://convergence-france.org/',
  },
].sort(sortByTitleOrKey);

const HIRED = [
  {
    key: 'webgeo',
    link: 'https://www.webgeoservices.com/fr/',
  },
  {
    key: 'greenfactory',
    link: 'https://www.greenfactory.fr/',
  },
  {
    key: 'coallia',
    link: 'https://coallia.org/',
  },
  {
    key: 'lafourche',
    link: 'https://lafourche.fr/',
  },
  {
    key: 'saveursbieres',
    link: 'https://www.saveur-biere.com/fr/',
  },
  {
    key: 'lescopains',
    link: 'https://www.lescopainsdebastien.fr/',
  },
  {
    key: 'clinitex',
    link: 'https://www.clinitex.fr/',
  },
  {
    key: 'sep',
    link: 'https://www.sep-renovation.fr/',
  },
  {
    key: 'seni',
    link: 'https://www.seni.fr/',
  },
  {
    key: 'laruche',
    link: 'https://laruchequiditoui.fr/fr/',
  },
  {
    key: 'iledefrance',
    link: 'https://www.iledefrance.fr/',
  },
  {
    key: 'randstad',
    link: 'https://www.grouperandstad.fr',
  },
  {
    key: 'quintesens',
    link: 'https://groupe-quintesens.fr/',
  },
  {
    key: 'nokia',
    link: 'https://www.nokia.com/fr_int/',
  },
  {
    key: 'murfy',
    link: 'https://murfy.fr/',
  },
  {
    key: 'micheletaugustin',
    link: 'https://www.micheletaugustin.com/',
  },
  {
    key: 'manomano',
    link: 'https://www.manomano.fr/',
  },
  {
    key: 'mbe',
    link: 'https://www.mbefrance.fr/fr',
  },
  {
    key: 'ybrush',
    link: 'https://y-brush.com/',
  },
  {
    key: 'lidl',
    link: 'https://www.lidl.fr/',
  },
  {
    key: 'franprix',
    link: 'https://www.franprix.fr/',
  },
  {
    key: 'foodcheri',
    link: 'https://www.foodcheri.com/',
  },
  {
    key: 'cybervadis',
    link: 'https://cybervadis.com/',
  },
  {
    key: 'carrefour',
    link: 'https://www.carrefour.fr/',
  },
  {
    key: 'anr',
    link: 'https://anr.fr/',
  },
  {
    key: 'leroymerlin',
    link: 'https://www.leroymerlin.fr/',
  },
  {
    key: 'reavie',
    link: 'http://asso-reavie.fr/',
  },
  {
    key: 'babou',
    link: 'https://www.bmstores.fr/',
  },
  {
    key: 'danialu',
    link: 'https://www.danialu.fr/',
  },
  {
    key: 'casaveg',
    link: 'https://casa-veg.com/',
  },
].sort(sortByTitleOrKey);

const SPORTS = [
  {
    key: 'redstar',
    title: 'Red Star',
    link: 'https://www.redstar.fr/',
  },
  {
    key: 'trracing',
    title: 'TR Racing',
    link: 'https://www.thomasruyant.com/',
  },
].sort(sortByTitleOrKey);

export default {
  STRATEGY,
  ASSOCIATIONS,
  SPORTS,
  HIRED,
  ORIENTATION,
  MAIN_FINANCE,
  YOUNG_FINANCE,
  ALL_FINANCE,
};
