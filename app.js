/* ═══════════════════════════════════════════════════════════
   FOUNDERSBADGE.COM — MASTER JAVASCRIPT
   Sections:
   01. Badge & Resource Data
   02. Global State (window.BadgeState)
   03. Component 1 — Sidebar Builder
   04. Component 2 — Badge Arrangement Renderer
   05. Component 3 — Badge Summary Renderer
   06. Component 4 — Journey to President Renderer
   07. Component 5 — Badge Requirements Renderer
   08. Component 6 — BB Resources Builder
   09. Component 7 — Sliding Puzzle
   10. Component 7 — Memory Match
   11. Shared: Master Render + Tab Nav + Mobile Sheet
   12. Init
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   01. BADGE & RESOURCE DATA
══════════════════════════════════════════════════════════ */

const COMPULSORY = [
  { id: 'target', name: 'TARGET', adv: false },
  { id: 'christian_ed', name: 'CHRISTIAN EDUCATION', adv: true },
  { id: 'drill', name: 'DRILL', adv: true },
  { id: 'recruitment', name: 'RECRUITMENT', adv: true },
];

const GROUP_A = [
  'ARTS', 'BANDSMAN', 'BUGLERS', 'COMMUNICATION', 'COMPUTER KNOWLEDGE',
  'CRAFTS', 'DRUMMERS', 'FINANCIAL STEWARDSHIP', 'HOBBIES',
  'INTERNATIONAL RELATIONS', 'NATURE AWARENESS', 'PIPERS',
].map(n => ({ id: n.toLowerCase().replace(/ /g, '_'), name: n, adv: true }));

const GROUP_B = ['CAMPING', 'EXPEDITION', 'WATER ADVENTURE']
  .map(n => ({ id: n.toLowerCase().replace(/ /g, '_'), name: n, adv: true }));

const GROUP_C = [
  'CITIZENSHIP', 'COMMUNITY SERVICE', 'ENVIRONMENTAL CONSERVATION',
  'FIRE AND RESCUE', 'FIRST AID', 'LIFE SAVING', 'SAFETY',
  'SOCIAL ENTREPRENEURSHIP', 'SUSTAINABILITY',
].map(n => ({ id: n.toLowerCase().replace(/ /g, '_'), name: n, adv: true }));

const GROUP_D = ['ATHLETICS', 'GYMNASTICS', 'MARTIAL ARTS', 'PHYSICAL TRAINING', 'SPORTS', 'SWIMMING']
  .map(n => ({ id: n.toLowerCase().replace(/ /g, '_'), name: n, adv: true }));

const ALL_PROF = [...COMPULSORY, ...GROUP_A, ...GROUP_B, ...GROUP_C, ...GROUP_D];
const RANKS = ['Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant'];

/* Abbreviations for arm chips */
const ABBREV = {
  target: 'TGT', christian_ed: 'C·E', drill: 'DRL', recruitment: 'RCT',
  arts: 'ART', bandsman: 'BND', buglers: 'BGL', communication: 'COM',
  computer_knowledge: 'CPT', crafts: 'CRF', drummers: 'DRM',
  financial_stewardship: 'FIN', hobbies: 'HOB', international_relations: 'I·R',
  nature_awareness: 'NAT', pipers: 'PIP', camping: 'CMP', expedition: 'EXP',
  water_adventure: 'WAT', citizenship: 'CTZ', community_service: 'C·S',
  environmental_conservation: 'ENV', fire_and_rescue: 'F+R', first_aid: 'F·A',
  life_saving: 'LSV', safety: 'SAF', social_entrepreneurship: 'S·E',
  sustainability: 'SUS', athletics: 'ATH', gymnastics: 'GYM', martial_arts: 'M·A',
  physical_training: 'P·T', sports: 'SPT', swimming: 'SWM',
};

/* Badge image maps */
const RIGHT_IMAGES = {
  target: 'image/Right/Target.png',
  christian_ed: 'image/Right/Christian Education.png',
  drill: 'image/Right/Drill.png',
  recruitment: 'image/Right/Recruitment.png',
  arts: 'image/Right/Arts.png',
  bandsman: 'image/Right/Bandsmans.png',
  buglers: 'image/Right/Buglers.png',
  communication: 'image/Right/Communication.png',
  computer_knowledge: 'image/Right/Computer Knowledge.png',
  crafts: 'image/Right/Crafts.png',
  drummers: 'image/Right/Drummers.png',
  financial_stewardship: 'image/Right/Financial Stewardship.png',
  hobbies: 'image/Right/Hobbies.png',
  international_relations: 'image/Right/International Relations.png',
  nature_awareness: 'image/Right/Nature Awareness.png',
  pipers: 'image/Right/Pipers.png',
  camping: 'image/Right/Camping.png',
  expedition: 'image/Right/Expedition.png',
  water_adventure: 'image/Right/Water Adventure.png',
  citizenship: 'image/Right/Citizenship.png',
  community_service: 'image/Right/Community Service.png',
  environmental_conservation: 'image/Right/Environmental Conservation.png',
  fire_and_rescue: 'image/Right/Fireman.png',
  first_aid: 'image/Right/First Aid.png',
  life_saving: 'image/Right/Life Saving.png',
  safety: 'image/Right/Safety.png',
  social_entrepreneurship: 'image/Right/Social Entreprenuership.png',
  sustainability: 'image/Right/Sustainability.png',
  athletics: 'image/Right/Athletics.png',
  gymnastics: 'image/Right/Gymnastics.png',
  martial_arts: 'image/Right/Martial Art.png',
  physical_training: 'image/Right/Physical Training.png',
  sports: 'image/Right/Sports.png',
  swimming: 'image/Right/Swimming.png',
};

const LEFT_IMAGES = {
  founders_award: 'image/Left/Founder.png',
  presidents_award: 'image/Left/Presidents.png',
  gold_award: 'image/Left/Gold.png',
  dofe_bronze: 'image/Left/Dofe Bronze.png',
  dofe_silver: 'image/Left/Dofe Silver.png',
  dofe_gold: 'image/Left/Dofe Gold.png',
  nco_proficiency: 'image/Left/NCO Proficiency Star.png',
  bronze_scholastic: 'image/Left/Scholastic Bronze.png',
  silver_scholastic: 'image/Left/Scholastic Silver.png',
  gold_scholastic: 'image/Left/Scholastic Gold.png',
  three_year: 'image/Left/Three-Years.png',
  long_year: 'image/Left/Long-Year.png',
  junior_section: 'image/Left/Junior One-Year.png',
  one_year: 'image/Left/One-Year.png',
  link: 'image/Left/Link Badge.png',
};

/* Badge requirements for Component 5 */
const BADGE_REQS = [
  {
    "id": "target",
    "name": "TARGET AWARD",
    "cat": "Compulsory",
    "grp": "comp",
    "adv": false,
    "basic": [
      "Regular in Company for at least 3 months or 25% of total attendance in a year/session",
      "Complete a course of instruction & pass a written test covering:",
      "  - BB Knowledge: Object, Motto, Logo, History, Company Organisation & Ranks, Uniform care, Awards Scheme intro, BB Asia overview, BB songs, Bugle calls",
      "  - Citizenship: National Flag, National Coat of Arms, National Anthem, Knowledge of Neighbourhood",
      "  - Christian Education/Character Education: Books of the Bible, Lord’s Prayer, BB Prayer & Table Grace, BB Hymns OR 10 character lessons + Anchor Song for non-Christian premises",
      "  - Drill: Recruits Drill, Paying Compliments",
      "May undertake Recruits/Boot Camp (2D/1N) as part of journey",
      "No other award may be worn before Target Award is fully completed"
    ],
    "advanced": null
  },
  {
    "id": "christian_ed",
    "name": "CHRISTIAN EDUCATION",
    "cat": "Compulsory",
    "grp": "comp",
    "adv": true,
    "basic": [
      "Attend at least 6 Bible study or devotion sessions during the programme year",
      "Submit a written personal reflection (min. 300 words) on a biblical theme",
      "Participate actively in at least 2 group devotion sessions",
      "Pass a basic scripture knowledge assessment set by the officer-in-charge"
    ],
    "advanced": [
      "Lead at least 2 devotion sessions for your company or platoon",
      "Complete an approved advanced Christian education workbook or curriculum",
      "Organise a faith-based community service activity and submit an evaluation",
      "Present a personal testimony at a company or battalion event"
    ]
  },
  {
    "id": "drill",
    "name": "DRILL",
    "cat": "Compulsory",
    "grp": "comp",
    "adv": true,
    "basic": [
      "Pass practical exam (BBM Drill Manual):",
      "  - Personal Drill: Basic Drill movements (static drill, marching, movement on march)",
      "  - Uniform: Maintain high standard for 3 months",
      "  - Squad Drill: Perform well as squad member",
      "  - Commanding: Give commands for all drill movements to squad of not less than 12 members",
      "Pass written exam: Definitions, Drill Theory, Words of command, Paying Compliments, Elementary Squad Drill"
    ],
    "advanced": [
      "Pass written & practical test on:",
      "  - Drill Movement for Colour Party and Guard of Honour",
      "  - Practical ability in teaching, instructing & commanding recruits on Basic Drill movements and Company members on Squad Drill"
    ]
  },
  {
    "id": "recruitment",
    "name": "RECRUITMENT",
    "cat": "Compulsory",
    "grp": "comp",
    "adv": true,
    "basic": [
      "Option 1: Recruit a new Member (never in any BB Company before) who is regular in attendance for 1 academic year",
      "Option 2: Play active role in Recruitment Committee, hold at least one important position, give a talk during recruiting sessions, assist in setting up an exhibition"
    ],
    "advanced": [
      "Option 1: Recruit another new recruit (never in any BB Company before) who is regular in attendance for 1 academic year",
      "Option 2: Be involved in Recruitment Committee for further 1 year in very important position, conduct talks & prepare recruiting sessions, organize recruiting programs for at least 3 months for new recruits including instructing in Target Award class"
    ]
  },
  {
    "id": "arts",
    "name": "ARTS",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Choose individual or group badge class",
      "Obtain Award Officer approval",
      "Submit work at regular intervals & keep logbook of time spent & work done",
      "Present end results for assessment",
      "Activities can include: Architectural Appreciation, Painting, Sculpture, Drama, Drawing & Design, Orchestral/Chamber music, Lino Printing, Musical activity (non-band), Print Making, Company Magazine production, Singing, Theatre Appreciation, Writing, Engraving"
    ],
    "advanced": [
      "Same structure as Basic but activity must differ from Basic level"
    ]
  },
  {
    "id": "crafts",
    "name": "CRAFT",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Choose individual or group badge class",
      "Obtain Award Officer approval",
      "Submit work at regular intervals & keep logbook",
      "Present end results for assessment",
      "Activities: Leatherwork, Macrame, Origami, Pottery, Puppetry, Household maintenance, Rug making, Sewing, Wood Carving, Basketry, Metal Work, Cooking, Carpentry & Woodwork, Model Making, Marquetry, Cane work, Canoe Construction"
    ],
    "advanced": [
      "Same structure as Basic but activity must differ from Basic level"
    ]
  },
  {
    "id": "hobbies",
    "name": "HOBBIES",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Choose individual or group badge class",
      "Obtain Award Officer approval",
      "Submit work at regular intervals & keep logbook",
      "Present end results for assessment",
      "Activities: Archaeology, Astronomy, Coin & Stamp Collection, Cycle Maintenance, Video Production, Fishing, Gemstones, Meteorology, Motor Mechanics, Radio Construction & Electronics, Railway Knowledge, Reading, Photography/Videography"
    ],
    "advanced": [
      "Same structure as Basic but activity must differ from Basic level"
    ]
  },
  {
    "id": "athletics",
    "name": "ATHLETICS",
    "cat": "Group D",
    "grp": "grpd",
    "adv": true,
    "basic": [
      "Choose 2 events from each group",
      "Meet minimum standards (synthetic surfaces) for your respective gender",
      "Events include: 100m, 200m, 400m, 800m, 1500m, Hurdles, High Jump, Long Jump, Triple Jump, Javelin, Discus, Shot Put",
      "Several attempts allowed before best time/distance taken"
    ],
    "advanced": [
      "Meet higher minimum standards (synthetic surfaces) for your respective gender in the events chosen"
    ]
  },
  {
    "id": "bandsman",
    "name": "BAND PROFICIENCY",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Active member of BB band for at least 1 year playing tested instrument",
      "Theory: Pass written exam at Grade 1 ABRSM level (exemption if passed Grade 1 ABRSM theory)",
      "Practical: Performed at least 3 times to public/non-BB audience, knowledge of instrument care & maintenance, sight-read simple piece",
      "Perform specific requirements based on instrument (Bandsman/Buglers/Drummers/Pipers)"
    ],
    "advanced": [
      "Active member for further 1 year",
      "Theory: Grade 2 ABRSM level (exemption if passed Grade 2)",
      "Practical: Play 2 pieces (one quick, one slow), performed another 3 times in public, sight-read more difficult piece",
      "Perform specific advanced requirements based on instrument"
    ]
  },
  {
    "id": "camping",
    "name": "CAMPING",
    "cat": "Group B",
    "grp": "grpb",
    "adv": true,
    "basic": [
      "Attend camping course (12 lessons) + spend 4 consecutive days under canvas",
      "Pass tests on: types of tents & uses, ancillary equipment, personal health & hygiene, campsite selection & layout, country code",
      "Prepare at least one meal in group of 3 or less, proper fire starting & kitchen hygiene",
      "With 3 non-Camping-Award members: pitch, strike & pack tent correctly",
      "Build a camping gadget & tie basic knots (reef, figure-of-eight, clove hitch, round turn & two half hitches, double sheet bend, timber hitch, buntline hitch, bowline, double black wall hitch, marine spike hitch)"
    ],
    "advanced": [
      "Attend further 12 lessons + 4 consecutive days under canvas",
      "Pass tests on: care/maintenance/storage of equipment, sanitation/hygiene/safety arrangements (latrines, rubbish disposal, food storage, water supply, fire precautions)",
      "Prepare a full day’s meal in group of 3 or less",
      "With 3 non-Camping-Award members: set up full campsite (tent, kitchen, toilet, campfire, fencing) within time limit",
      "Additional knots (timber hitch & half turn, rolling hitch, fisherman’s bend, running bowline, French bowline, slip knot, middleman & butterfly knot, lashings) + all Basic knots"
    ]
  },
  {
    "id": "citizenship",
    "name": "CITIZENSHIP",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Attend course of at least 3 months on one of: National Government, Judicial systems, Anti-drug abuse, or Crime prevention"
    ],
    "advanced": [
      "Individually or in group: detailed further study on above topics covering:",
      "  - Respective agencies involved",
      "  - Contacts & people running agencies",
      "  - NGOs assisting these agencies",
      "  - Visits to agencies",
      "  - How to get involved in supporting government’s efforts"
    ]
  },
  {
    "id": "communication",
    "name": "COMMUNICATION",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Theory: Complete at least 3 lessons from Communication Topic List (History of communication compulsory)",
      "Practical Part 1 (Personal): Conduct 15-min 1-to-1 interview with parent/guardian/teacher/officer/church youth advisor, present summary",
      "Practical Part 2 (Public - choose one): Give presentation/speech to squad/group, OR participate in group discussion/debate, OR manage Company’s social media platform for not less than 1 month"
    ],
    "advanced": [
      "Theory: Complete at least 3 lessons from Topic List",
      "Practical Part 1 (Personal): 15-min interview with Company Chaplain/Company Captain/Church Leader/School principal, present summary",
      "Practical Part 2 (Public - choose one): Give speech to audience of 20+ from other BB Company, OR lead group discussion/debate, OR teach basic Malaysia sign language, OR manage Company’s social media platform for not less than 3 months"
    ]
  },
  {
    "id": "community_service",
    "name": "COMMUNITY SERVICE",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Demonstrate knowledge of community service organisations",
      "Volunteer at a service organisation for at least 15 hours",
      "Prepare detailed report (written or visual aids) on project & evaluation"
    ],
    "advanced": [
      "Attend course covering problems of: Children, Youth, Adults, Elderly, Handicapped, Drug Addicts, Immigrants, Refugees",
      "Conduct detailed study of service organisations in Malaysia (beyond Basic level), make visits",
      "Plan & carry out service project of at least 25 hours with any organisation"
    ]
  },
  {
    "id": "computer_knowledge",
    "name": "COMPUTER KNOWLEDGE",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Part 1: Presentation on Personal Computing (background/trends/development, hardware, software, producers, or related topic)",
      "Part 2: One project using at least two software categories: Word processing, Spreadsheet, Presentation graphics, Photo editing/Digital drawing, Webpage builder, Setting up social media platforms"
    ],
    "advanced": [
      "Part 1: Presentation on Cloud Computing (background/trends/development, hardware, software, providers, or related topic)",
      "Part 2: One project benefiting BB Company using at least one: Video editing, Web application development, Game application/resource development, Mobile app development, Internet-of-Things, Generative AI"
    ]
  },
  {
    "id": "environmental_conservation",
    "name": "ENVIRONMENTAL CONSERVATION",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Know the minimum impact code.",
      "Suggest ways of re-using the following items:",
      "  - glass jars",
      "  - plastics ice-cream containers",
      "  - books, Christmas cards, greeting cards",
      "  - postage stamps",
      "  - toys",
      "  - old clothes",
      "Investigate and report on local opportunities for recycling three of the following items:",
      "  - newspaper",
      "  - glass",
      "  - scrap metal",
      "Prepare a scrapbook of twenty newspaper and magazine articles about conservation and write a thoughtful comment about each article."
    ],
    "advanced": [
      "Collect plastic, metal and glass rubbish from beach, lakeshores or stream and explain how three of these items could harm wildlife.",
      "Present a 5-minutes talk to a small group of people.",
      "Describe six things Malaysian motorists can do to conserve fossil fuels.",
      "Prepare an eye-catching and informative feature page (pages) for a teenage newspaper or magazine about rare and endangered plants and animals in Malaysia.",
      "Interview a member of a non-government conservation group about the group's activities. Take part in one of their project to improve a local place e.g.",
      "  - remove rubbish and weeds.",
      "  - plant trees and shrubs.",
      "  - plant and maintain a flower garden."
    ]
  },
  {
    "id": "expedition",
    "name": "EXPEDITION",
    "cat": "Group B",
    "grp": "grpb",
    "adv": true,
    "basic": [
      "Theory syllabus: Packing rucksack, simple cooking under camp conditions, basic map & compass reading, camp craft, country code",
      "Practical (on foot): Undertake walk of at least 16km in open country following pre-selected route",
      "Prepare log of journey (adult leader must accompany)",
      "Spend one night under canvas (lightweight equipment) including cooking evening meal & breakfast"
    ],
    "advanced": [
      "Undertake expedition of at least 24km over 2 days including 1 night in tents/bivouacs",
      "At least 2 hot meals (no food bought en route)",
      "Carry all equipment",
      "Scaling mountains limits apply (e.g., Gunung Tahan, Himalayan Range = Advanced)"
    ]
  },
  {
    "id": "financial_stewardship",
    "name": "FINANCIAL STEWARDSHIP",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Theory (written or verbal exam): Biblical foundations as steward of God’s money, Tithing, God’s Ownership, Budgeting, Saving, Spend with purpose, Giving joyfully, Personal budgeting, Expenses tracking, Personal accounting",
      "Practical (3 consecutive months): Submit monthly budget (spending, saving, tithing), submit monthly expenses report, submit reflection report (written or verbal)"
    ],
    "advanced": [
      "Theory (written/verbal exam): Biblical teaching on debts & investments, Financial risk management, Project financial management, accountability & integrity, Project budgeting, Project accounting",
      "Practical: Present on types of debts (pros & cons), present on types of investment & risks, assist in managing project/event/Company’s finance for at least half a year (supervised by Officer)"
    ]
  },
  {
    "id": "fire_and_rescue",
    "name": "FIRE AND RESCUE",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Theory: Basic knowledge of Fire Science, methods of extinguishing fire, common causes of fire, classification of fire, escape from fire & smoke",
      "Practical: Basic rescue methods (Fireman’s lift, emergency methods of removing casualties), visit to Fire Station or Civil Defence Department"
    ],
    "advanced": [
      "Theory: Fire Service/Civil Defence Organisation, Fire fighting & rescue equipment (types, maintenance, operations), Fire service appliances, Water supply",
      "Practical: Operate fire hydrant (connecting hose, turning on system, cleaning/storing), escape from burning building (ascending & descending), visit fire station or civil defence centre"
    ]
  },
  {
    "id": "first_aid",
    "name": "FIRST AID",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Principles & practice of First Aid",
      "Dressings & application",
      "Burns & scalds",
      "Shock (definition, causes, signs, treatment)",
      "Resuscitation (CPR)",
      "Fractures (definition, types, signs, dangers, treatment included wooden splints, splint-less, improvised)"
    ],
    "advanced": [
      "Wounds, Unconsciousness",
      "Roller bandaging (skull, eye, palm, elbow, knee, chest, abdomen, foot)",
      "Types of burns & treatment",
      "Miscellaneous conditions (gastritis, rashes, bruises, cough, dislocation, epilepsy, sprain, cramps, stings & bites)",
      "Transportation of casualty",
      "Note: Members with PBSM or St. John’s certificate at equivalent level may be awarded"
    ]
  },
  {
    "id": "gymnastics",
    "name": "GYMNASTICS",
    "cat": "Group D",
    "grp": "grpd",
    "adv": true,
    "basic": [
      "Attend course & training (qualified instructor, 3 months)",
      "Complete any 2 categories from: Agility, Vaulting, Trampoline, Parallel bars, Backward roll, Cat spring, Horizontal stride vault, Forward roll matched, Back drop half twist, Half turntable, Knee drop front somersault, Strength & stamina"
    ],
    "advanced": [
      "Attained Basic in previous session OR further training",
      "Complete further 4 categories not completed in Basic",
      "Warning: Qualified instructor & suitable gear required — failure could cause severe injuries"
    ]
  },
  {
    "id": "international_relations",
    "name": "INTERNATIONAL RELATIONS",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Theory (12 classes/hours): BB Asia (history, set-up, activities), study BB in 3 overseas Asian countries, prepare write-up on one country studied",
      "Practical (choose one): Play active part in activity with BB Asia members, OR visit BB Company in Asian region and give presentation, OR encourage Asian region members to visit Malaysia/join BB activities"
    ],
    "advanced": [
      "Theory: Global Fellowship (history, set-up, activities), study BB in 2 overseas countries outside Asia",
      "Practical: Write to at least 3 members from different non-Asian countries for 3+ months, introduce Malaysia’s culture, give presentation at Company Parade on one non-Asian BB country, OR prepare scrapbook on one non-Asian BB country"
    ]
  },
  {
    "id": "life_saving",
    "name": "LIFE SAVING",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Water Safety & Rescue: Answer 6 questions",
      "Resuscitation: Complete RLSS Resuscitation Award (First Aid Basic exempts)",
      "Water tests: Reaching rescue, Throwing rescue, Buoyant aid accompanied rescue, Wade & pole rescue",
      "Feet-first surface dive (1.5m deep, swim 10m, 2 strokes underwater)",
      "2 defense actions (Reverse, Single Leg Block, Counter to Leg Clutch, Duck Away)",
      "Swim 150m continuous (4 min limit): 50m head-up front, 50m sidestroke, 50m lifesaving backstroke (no arms) — Swimming Basic exempts"
    ],
    "advanced": [
      "Requires First Aid Basic + Swimming Advanced",
      "Water Safety & Rescue: Answer 6 questions (RLSS)",
      "Emergency Aid: First Aid Basic exempts resuscitation/CPR/First Aid",
      "Water tests: Reaching rescue (using clothing), Throwing rescue (1 min limit), Cross Chest Tow, Towing with non-rigid non-buoyant aid",
      "Combined rescue (20m swim, 5m underwater search, exchange object, tow, EAR, recovery position)",
      "Chin tow rescue, 25m underwater swim, Releases from 3 types of clutches + 3 towing techniques over 25m"
    ]
  },
  {
    "id": "martial_arts",
    "name": "MARTIAL ARTS",
    "cat": "Group D",
    "grp": "grpd",
    "adv": true,
    "basic": [
      "Good attendance & pass exam from accredited martial arts organisation",
      "Judo: Green belt",
      "Taekwondo/Karate: Blue belt"
    ],
    "advanced": [
      "Judo: Brown belt",
      "Taekwondo/Karate: Brown 2 belt"
    ]
  },
  {
    "id": "nature_awareness",
    "name": "NATURE AWARENESS",
    "cat": "Group A",
    "grp": "grpa",
    "adv": true,
    "basic": [
      "Attend course (3 months or 12 lessons)",
      "Read ordinance survey map & use compass for simple direction finding",
      "Know the country code",
      "Undertake visits to local habitat, note flora & fauna",
      "Draw sketch map of habitat with notes & drawings",
      "Make small labelled collection (wild flowers, leaves, insects, rock fossils, shells) OR show interest in bird watching or fishing"
    ],
    "advanced": [
      "Maintain visits, add further specimens",
      "12km walk observing natural history en route",
      "Use textbooks to identify specimens",
      "Identify from specimens/photos: wild flowers, trees, fungi, insects, butterflies, mammals, birds, fish, rocks, fossils, shells",
      "Understand different soils, bedrock, how habitats differ & factors affecting environment",
      "Undertake simple project (bark rubbings, animal footprints, nature scrapbook, animal/plant sketching, etc.)"
    ]
  },
  {
    "id": "physical_training",
    "name": "PHYSICAL TRAINING",
    "cat": "Group D",
    "grp": "grpd",
    "adv": true,
    "basic": [
      "Theory: Attend course on basic principles of physical training, understanding need for warm-ups",
      "Practical: Attend training sessions (½ hour each including warm-up, circuit training, farley, short distance jogging, variable training, movement training, physical efficiency exercise, warm down)",
      "Show satisfactory improvement, achieve standard appropriate to age & natural ability"
    ],
    "advanced": [
      "Theory: Attend course on functions of muscles, blood circulation, brain system during/after training, principles of anaerobic/aerobic training, lactate threshold",
      "Practical: Show further improvement for another 1 session, lead other members in physical training, achieve standard appropriate to age & natural ability"
    ]
  },
  {
    "id": "safety",
    "name": "SAFETY",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Present on: causes & prevention of accidents (home, school, water, road, sports) + personal physical safety",
      "Organize safety campaign at school or local church",
      "Conduct risk assessment of Company Parade meeting place"
    ],
    "advanced": [
      "Research & present on Cyber Safety for young people: Digital Citizenship, Privacy & Security, Principles of Cyber Security, Cyberbullying, Personal Data & Identity Theft",
      "Other topics as deemed appropriate by Officer/Instructor"
    ]
  },
  {
    "id": "sustainability",
    "name": "SUSTAINABILITY",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Individually or in group: project contributing to at least 1 Sustainable Development Goal (SDG)",
      "Directly positively impact local community within Company’s district/township",
      "Complete project over minimum 3 sessions (total min 15 hours)",
      "Submit post-project report (written, slides, or video)"
    ],
    "advanced": [
      "Group of 2–20 members from at least 2 different Companies",
      "Project contributes to at least 1 SDG NOT undertaken at Basic level by individual member",
      "Directly positively impact local community",
      "Complete project over minimum 6 sessions (total min 30 hours)",
      "Submit post-project report (written, slides, or video)"
    ]
  },
  {
    "id": "social_entrepreneurship",
    "name": "SOCIAL ENTREPRENEURSHIP",
    "cat": "Group C",
    "grp": "grpc",
    "adv": true,
    "basic": [
      "Individual member participates in entrepreneurship project with a social enterprise, OR research study on social enterprise project outside Malaysia",
      "Present summary highlighting: Goals & objectives, Venue & Time, Problem statement & solutions, Stakeholders, Impact on local community, Financials, Reflection"
    ],
    "advanced": null
  },
  {
    "id": "sports",
    "name": "SPORTS",
    "cat": "Group D",
    "grp": "grpd",
    "adv": true,
    "basic": [
      "Participate in activity for at least 1 academic year",
      "Attend training sessions & show progress in personal performance",
      "Actively involved in competitions at Company, School, State, National or International levels (squad/class/house/club levels not recognised)",
      "Show knowledge of sport’s wider aspect (history, rules, competitions, etc.)",
      "Note: Does not include swimming or athletics"
    ],
    "advanced": [
      "Either: Continue same sport for another session, show further progress & skills, compete at higher level, if team sport play regular position",
      "Or: Participate in another sport for another session and qualify as per Basic level"
    ]
  },
  {
    "id": "swimming",
    "name": "SWIMMING",
    "cat": "Group D",
    "grp": "grpd",
    "adv": true,
    "basic": [
      "Choose one test: 100m freestyle, 100m butterfly, 100m breaststroke, 100m backstroke, or 400m any style (with relevant time limits)",
      "Plus: Tread water 30 seconds, swim 15m underwater in 17 seconds"
    ],
    "advanced": [
      "Choose one test: 100m freestyle, 100m butterfly, 100m breaststroke, 100m backstroke, or Rampai individu (with harder time limits)",
      "Plus: Dive from at least 2m height, swim 5.5m surface → dive to 1.6m → raise 500g weight → return to start (OR swim 18m underwater with dive/plunge), swim 400m freestyle in 11:56"
    ]
  },
  {
    "id": "water_adventure",
    "name": "WATER ADVENTURE",
    "cat": "Group B",
    "grp": "grpb",
    "adv": true,
    "basic": [
      "Choose activity: board sailing, blackwater rafting, jet skiing, motor cruising, tubing, sailing, snorkelling, kayaking, canoeing, scuba diving, etc.",
      "Canoeing theory: Types of canoe & history, Water Safety Code, proper maintenance & storage",
      "Canoeing practical: Carry canoe, demonstrate T rescue & H rescue, forward/backward paddling & emergency stop, canoe at least 1km and back",
      "Note: Members with Malaysia Canoeing Association 2 Star qualify"
    ],
    "advanced": [
      "Demonstrate all strokes taught (forward/backward paddling, emergency stops, sweep strokes, recovery, sculling draw, draw strokes, ferry glide)",
      "Carry out running repairs on test canoe",
      "Answer oral questions on canoe camping principles, safety, rules, access problems in own locality",
      "Note: Malaysia Canoeing Association 3 Star qualifies; 10-day ‘Tunas Samudera’ automatically awards Advanced"
    ]
  },
  {
    "id": "junior_section",
    "name": "JUNIOR SECTION SERVICE BADGE",
    "cat": "Service Awards",
    "grp": "svc",
    "adv": false,
    "imgKey": "junior_section",
    "isLeft": true,
    "basic": [
      "Completed at least three years of service in Junior Section",
      "Awarded only when the member is in the Senior Section"
    ],
    "advanced": null
  },
  {
    "id": "one_year",
    "name": "ONE YEAR SERVICE BADGE",
    "cat": "Service Awards",
    "grp": "svc",
    "adv": false,
    "imgKey": "one_year",
    "isLeft": true,
    "basic": [
      "Served for one session/year",
      "Must be an example to other Members (good conduct, role model)",
      "Shown improvement in: Spiritually, Physically, Socially, and Educationally",
      "Puts into practice what the Brigade taught",
      "Attendance at 80% and above at Parades and Christian Education Classes",
      "Members may collect multiple Service Badges during service"
    ],
    "advanced": null
  },
  {
    "id": "three_year",
    "name": "THREE YEAR SERVICE BADGE",
    "cat": "Service Awards",
    "grp": "svc",
    "adv": false,
    "imgKey": "three_year",
    "isLeft": true,
    "basic": [
      "Served for three years/sessions with good conduct",
      "Fulfilled all requirements of the One Year Service Badge",
      "Awarded and worn after the third session"
    ],
    "advanced": null
  },
  {
    "id": "long_year",
    "name": "LONG YEAR SERVICE BADGE",
    "cat": "Service Awards",
    "grp": "svc",
    "adv": false,
    "imgKey": "long_year",
    "isLeft": true,
    "basic": [
      "Served for not less than 5 years/sessions",
      "Total of 5 years does not need to be consecutive",
      "Awarded and worn after the fifth session"
    ],
    "advanced": null
  },
  {
    "id": "link",
    "name": "LINK BADGE",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "link",
    "isLeft": true,
    "basic": [
      "Awarded upon promotion from Junior Section to Senior Section",
      "Must have completed at least one year in Junior Section",
      "Must have attained at least two Junior Section Achievement Awards",
      "Attendance must be at least 80% in Junior Section",
      "Awarded only after Member has joined Senior Section for at least three months",
      "Purpose: encourage continued involvement in Senior Section"
    ],
    "advanced": null
  },
  {
    "id": "founders_award",
    "name": "FOUNDER'S AWARD",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "founders_award",
    "isLeft": true,
    "basic": [
      "Must be a President's Award holder",
      "Maximum age: 20 years old",
      "Show loyalty to Company, accept leadership and responsibility",
      "Complete criteria in latest Founder’s Award Guideline",
      "40 hours of community service",
      "Continue membership in Senior Section for further at least two (2) years",
      "Attend interview by State Commissioner",
      "Character Assessment by: Parent, Teacher, Captain, Chaplain"
    ],
    "advanced": null
  },
  {
    "id": "presidents_award",
    "name": "PRESIDENT'S AWARD",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "presidents_award",
    "isLeft": true,
    "basic": [
      "Minimum age: 15 years old, Maximum: 19 years old",
      "Must be an NCO in the Company",
      "Minimum awards required: NCO Proficiency Star (Advanced), Christian Education (Advanced), Drill (Advanced), Recruitment (Basic)",
      "At least three years of service in Senior Section",
      "At least six awards from Group A, B, C, and D (At least one award from each group, minimum two Basic and four Advanced Level)"
    ],
    "advanced": null
  },
  {
    "id": "gold_award",
    "name": "GOLD AWARD (Junior Section)",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "gold_award",
    "isLeft": true,
    "basic": [
      "Highest award in the Junior Section",
      "Members continue wearing this award in the Senior Section"
    ],
    "advanced": null
  },
  {
    "id": "dofe",
    "name": "DUKE OF EDINBURGH",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "dofe_gold",
    "isLeft": true,
    "basic": [
      "Awarded for completion in: Physical Recreation, Adventurous Journey, Skills, Community Service",
      "Bronze Level: 14 years old (15 hours PR/Skills/CS, 2 days/1 night Adventurous Journey)",
      "Silver Level: 15 years old (30 hours PR/Skills/CS, 3 days/2 nights Adventurous Journey)",
      "Gold Level: 16 years old (60 hours PR/Skills/CS, 4 days/3 nights Adventurous Journey, Residential Project)"
    ],
    "advanced": null
  },
  {
    "id": "bronze_scholastic",
    "name": "BRONZE SCHOLASTIC AWARD",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "bronze_scholastic",
    "isLeft": true,
    "basic": [
      "Applicant must have obtained at least 3A's and 1B's in final year of examination or 6th year of Primary education",
      "Did not fail in any papers and subjects in the official examination recognised by the MOE"
    ],
    "advanced": null
  },
  {
    "id": "silver_scholastic",
    "name": "SILVER SCHOLASTIC AWARD",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "silver_scholastic",
    "isLeft": true,
    "basic": [
      "Applicant must have obtained at least 4A's and 2B's in third year of Secondary education or final year of Lower Secondary",
      "Must have achieved qualifying results on the first attempt",
      "Did not fail in any papers and subjects in the official examination recognised by MOE"
    ],
    "advanced": null
  },
  {
    "id": "gold_scholastic",
    "name": "GOLD SCHOLASTIC AWARD",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "gold_scholastic",
    "isLeft": true,
    "basic": [
      "Applicant must have obtained at least 3A's and the rest of the papers/subjects must be at least Credits/C in final year of Secondary education",
      "Must have achieved qualifying results on the first attempt",
      "Did not fail any papers in the official examination recognised by MOE"
    ],
    "advanced": null
  },
  {
    "id": "nco_proficiency",
    "name": "NCO PROFICIENCY",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": true,
    "imgKey": "nco_proficiency",
    "isLeft": true,
    "basic": [
      "Basic NCO Certificate: Awarded upon completion and passing of syllabus of Basic NCO Training conducted at Brigade or State level"
    ],
    "advanced": [
      "Advanced Level — NCO Proficiency Star: Minimum rank Lance Corporal, attended course conducted at Brigade level, awarded upon completing and passing assessment"
    ]
  },
  {
    "id": "link",
    "name": "LINK BADGE",
    "cat": "Special Awards",
    "grp": "spl",
    "adv": false,
    "imgKey": "link",
    "isLeft": true,
    "basic": [
      "Awarded upon promotion from Junior Section to Senior Section",
      "Must have completed at least one year in Junior Section",
      "Must have attained at least two Junior Section Achievement Awards",
      "Attendance must be at least 80% in Junior Section",
      "Awarded only after Member has joined Senior Section for at least three months",
      "Purpose: encourage continued involvement in Senior Section"
    ],
    "advanced": null
  }
];

/* BB Resources data */
const SONGS = [
  {
    title: "The Anchor Song",
    lyrics: `Verse 1:
      There's an emblem fair that is known to all,
      A sign to help us through.
      It stands for strength and it stands for right,
      An anchor tried and true.
      The emblem of the Boys' Brigade,
      It helps us on our way;
      Our fathers knew in days gone by,
      This sign we know today.

      Chorus:
      Sure and Steadfast!
      The Brigade Boys' motto clear.
      That's our watch-word
      When troubles and trials are near.
      Sure and Steadfast!
      To the flag that flies above;
      In all that we do, we try to be true
      To the Anchor that we love.

      Verse 2:
      With gallant heart and gallant soul,
      On life's broad sea we'll sail.
      What-e'er storms of life may bring,
      Our Anchor must prevail.
      Although the clouds may cross the sun,
      And skies grow dark and grey,
      We'll face the foe until we've won
      A glorious victory.`,
    note: "The primary anthem of the Boys' Brigade."
  },
  {
    title: "Will Your Anchor Hold",
    lyrics: `Will your anchor hold in the storms of life,
      When the clouds unfold their wings of strife?
      When the strong tides lift and the cables strain,
      Will your anchor drift, or firm remain?

      Chorus:
      We have an anchor that keeps the soul
      Steadfast and sure while the billows roll,
      Fastened to the Rock which cannot move,
      Grounded firm and deep in the Saviour's love.`,
    note: "Traditional hymn by Priscilla Owens (1882)."
  },
  {
    title: "Mighty Band of Brothers",
    lyrics: `Verse 1:
      Sing a song together as we march along,
      All the way hip-hoo-ray let us swing.
      Come along and join us and you can't go wrong,
      We rejoice hear and voice as we sing.
      Join the great parade of The Boys' Brigade,
      Loudly let your voices ring!

      Chorus:
      We're a mighty band of brothers,
      spreading out across the world.
      Over continent and island,
      see the B.B. flag unfurled.
      We have one great cause and it must prevail,
      With a stalwart faith that can never fail.
      We're a mighty band of brothers,
      Ever steadfast ever sure.

      Verse 2:
      Life's a great adventure and we hear the call,
      To the fight for the right thro' and thro'.
      Boys' Brigade throughout the world are comrades all,
      We're united in all that we do.
      With our vision clear, what have we to fear,
      So long as to our trust we're true.`,
    note: "A song celebrating the global brotherhood of the Boys' Brigade."
  },
  {
    title: "Underneath The Banner",
    lyrics: `Verse 1:
      Underneath the banner of the Cross arrayed,
      Lord we ask Thy blessing on The Boys' Brigade;
      Thou art our Commander and Thy soldiers we,
      And in Christian warfare we would honour Thee.

      Chorus:
      Underneath the banner of the Cross arrayed,
      Lord we ask thy blessing on The Boys' Brigade.

      Verse 2:
      In each lowly service as on Drill Parade,
      "Duty" be the watchword of The Boys' Brigade;
      Make us ever loyal small or great the foe,
      Lead us, Saviour! Lead us everywhere we go.

      Verse 3:
      We will fight for laurels that will never fade,
      For the Holy City march The Boys' Brigade;
      What we find unholy in our daily life,
      We will try to conquer – Help us in the strife.`,
    note: "A traditional hymn refocusing on the Christian mission and duty."
  },
  {
    title: "Table Grace",
    lyrics: `Be present at our table, Lord,
      Be here and everywhere adored.
      Thy creatures bless, and grant that we
      May feast in paradise with Thee.

      Amen.`,
    note: "Sung before meals. All stand with heads bowed."
  },
  {
    title: "Boys' Brigade Vesper",
    lyrics: `Great God who knowest all our needs,
      Bless Thou our watch and guard our sleep.
      Forgive our sins of thoughts and deeds,
      And in Thy peace Thy servants keep.

      We thank Thee for the day that's done,
      We trust Thee for the days to be.
      Thy love we learn in Christ Thy Son,
      O may we all, His glory see!

      Amen.`,
    note: "Sung at the close of the day. All stand to attention."
  }
];

const BUGLE_CALLS = [
  { name: 'Reveille (Rouse)', desc: 'Roll call for the start of the day, used to wake members in the early morning.', time: 'Dawn · Camp Mornings' },
  { name: 'Warning for Parade', desc: 'Warning members and officers to make final preparations before falling in (usually played 15 mins before).', time: '15 Mins Before Parade' },
  { name: 'Fall In', desc: 'Calling members and officers to fall in. Should be in Sedia position when hearing this call.', time: 'Parade Assembly' },
  { name: 'Dismiss (or No Parade)', desc: 'Signalling to members and officers for dismissal.', time: 'End of Day/Parade' },
  { name: 'Retreat (Sunset)', desc: 'Played at the end of a BB parade during dismissal. Often played in conjunction with lowering the flag.', time: 'Sunset · Flag Lowering' },
  { name: 'Tattoo (Last Post)', desc: 'Played at night before bedtime. Signal for members to get ready to retire for the night.', time: 'Bedtime Signal' },
  { name: 'Lights Out', desc: 'To indicate that all lights should be turned off for the night.', time: 'Sleep Signal' },
  { name: 'General Salute', desc: 'Played when a general salute is given, especially during an inspection of the Guard of Honor.', time: 'Formal Inspections' },
  { name: 'Officers', desc: 'Calling specifically for officers to assemble / fall in.', time: 'Officers Only' },
  { name: 'Dinner Call (1st & 2nd)', desc: 'Notifying members and officers to gather for dinner or meals.', time: 'Meal Times' },
  { name: 'Orderly Sergeants', desc: 'Calling specifically for Orderly Sergeant to fall in during parade.', time: 'NCO Duty Call' },
  { name: 'Fire Alarm', desc: 'Used as a signal to alert members to an emergency.', time: 'EMERGENCY' },
];

const DOWNLOADS = [
  { icon: '📋', name: 'Coming Soon', size: 'PDF · Updated 2026' },
  { icon: '📋', name: 'Coming Soon', size: 'PDF · Updated 2026' },
  { icon: '📋', name: 'Coming Soon', size: 'PDF · Updated 2026' },
];

/* Memory game word pairs */
const MEM_PAIRS = [
  { w: 'ANCHOR', bg: '#1B4F8A' },
  { w: 'TARGET', bg: '#7B3308' },
  { w: 'DRILL', bg: '#1A6B3A' },
  { w: 'MARCH', bg: '#6C2F8C' },
  { w: 'SERVE', bg: '#A33020' },
  { w: 'FAITH', bg: '#1A5870' },
];



/* ══════════════════════════════════════════════════════════
   02. GLOBAL STATE — window.BadgeState
══════════════════════════════════════════════════════════ */
window.BadgeState = (() => {
  function fresh() {
    const badges = {};
    COMPULSORY.forEach(b => { badges[b.id] = { basic: false, advanced: b.adv ? false : null }; });
    [...GROUP_A, ...GROUP_B, ...GROUP_C, ...GROUP_D].forEach(b => {
      badges[b.id] = { basic: false, advanced: false };
    });
    return {
      badges,
      rank: null,
      service: { link: false, junior_section: false, one_year_count: 0, three_year: false, long_year: false },
      special: {
        nco_proficiency: false,
        bronze_scholastic: false, silver_scholastic: false, gold_scholastic: false,
        gold_award: false, dofe: null,
        presidents_award: false, founders_award: false,
      },
      presidentsAwardUnlocked: false,
    };
  }

  let _state = fresh();
  const _subscribers = new Set();
  const deepCopy = () => JSON.parse(JSON.stringify(_state));
  const notify = () => { const s = deepCopy(); _subscribers.forEach(fn => fn(s)); };

  return {
    getState: deepCopy,
    subscribe(fn) { _subscribers.add(fn); return () => _subscribers.delete(fn); },

    toggleBadgeLevel(id, level) {
      if (!_state.badges[id]) return;
      if (level === 'advanced' && _state.badges[id].advanced === null) return;

      let turningOn = false;
      let turningOff = false;

      if (level === 'advanced') {
        if (_state.badges[id].advanced) {
          _state.badges[id].advanced = false;
        } else {
          _state.badges[id].advanced = true;
          _state.badges[id].basic = true;
          turningOn = true;
        }
      } else {
        if (_state.badges[id].basic) {
          _state.badges[id].basic = false;
          _state.badges[id].advanced = false;
          turningOff = true;
        } else {
          _state.badges[id].basic = true;
          turningOn = true;
        }
      }

      // 1. If Target is unchecked, uncheck all right arm badges
      if (id === 'target' && turningOff) {
        Object.keys(_state.badges).forEach(k => {
          _state.badges[k].basic = false;
          _state.badges[k].advanced = false;
        });
      }

      // 1b. If any right arm badge is checked, Target must be checked
      if (turningOn && _state.badges['target'] && id !== 'target') {
        _state.badges['target'].basic = true;
      }

      notify();
    },

    setRank(rank) {
      _state.rank = (_state.rank === rank) ? null : rank;
      if (!_state.rank) { _state.special.nco_proficiency = false; _state.special.presidents_award = false; _state.special.founders_award = false; }
      notify();
    },

    setDofe(level) { _state.special.dofe = (_state.special.dofe === level) ? null : level; notify(); },

    setServiceYears(n) {
      _state.service.one_year_count = Math.max(0, Math.min(9, n));
      const count = _state.service.one_year_count;
      if (count >= 3 && count < 5) {
        _state.service.three_year = true;
        _state.service.long_year = false;
      } else if (count >= 5) {
        _state.service.three_year = true;
        _state.service.long_year = true;
      } else {
        _state.service.three_year = false;
        _state.service.long_year = false;
      }
      notify();
    },

    toggleService(key) {
      if (_state.service[key] === undefined) return;
      _state.service[key] = !_state.service[key];

      const turningOn = _state.service[key];

      if (key === 'three_year') {
        if (turningOn) {
          if (_state.service.one_year_count < 3) {
            _state.service.one_year_count = 3;
          }
        } else {
          _state.service.long_year = false;
          if (_state.service.one_year_count >= 3) {
            _state.service.one_year_count = 2;
          }
        }
      }

      if (key === 'long_year') {
        if (turningOn) {
          if (_state.service.one_year_count < 5) {
            _state.service.one_year_count = 5;
          }
          _state.service.three_year = true;
        } else {
          if (_state.service.one_year_count >= 5) {
            _state.service.one_year_count = 4;
          }
        }
      }

      notify();
    },

    toggleSpecial(key) {
      if (_state.special[key] === undefined || typeof _state.special[key] === 'string') return;
      if (key === 'nco_proficiency' && !_state.rank) return;
      if (key === 'presidents_award' && !_state.presidentsAwardUnlocked) return;
      if (key === 'founders_award' && !_state.special.presidents_award) return;
      _state.special[key] = !_state.special[key];
      if (key === 'presidents_award' && !_state.special.presidents_award) _state.special.founders_award = false;
      notify();
    },

    setPresidentsAwardUnlocked(bool) {
      _state.presidentsAwardUnlocked = bool;
      if (!bool) { _state.special.presidents_award = false; _state.special.founders_award = false; }
      notify();
    },

    reset() { _state = fresh(); notify(); },
  };
})();


/* ══════════════════════════════════════════════════════════
   03. COMPONENT 1 — SIDEBAR BUILDER
══════════════════════════════════════════════════════════ */
function buildSelectorContent(container) {
  container.innerHTML = '';

  function section(title, bodyFn, collapsed = false) {
    const el = document.createElement('div');
    el.className = 'sb-section' + (collapsed ? ' collapsed' : '');
    const hd = document.createElement('div');
    hd.className = 'sb-section-hd';
    hd.innerHTML = `<span class="sb-section-title">${title}</span><span class="sb-section-count"></span><span class="sb-chevron">▾</span>`;
    hd.addEventListener('click', () => el.classList.toggle('collapsed'));
    const bd = document.createElement('div');
    bd.className = 'sb-section-bd';
    bodyFn(bd);
    el.append(hd, bd);
    container.appendChild(el);
  }

  function groupLabel(text, parent) {
    const d = document.createElement('div');
    d.className = 'sb-group-label';
    d.textContent = text;
    parent.appendChild(d);
  }

  function badgeRow(badge, parent) {
    const row = document.createElement('div');
    row.className = 'bdg-row';
    const thumb = document.createElement('img');
    thumb.src = RIGHT_IMAGES[badge.id] || '';
    thumb.alt = badge.name;
    thumb.className = 'bdg-thumb';
    const nm = document.createElement('div');
    nm.className = 'bdg-row-name';
    nm.textContent = badge.name;
    nm.title = badge.name;
    const tgs = document.createElement('div');
    tgs.className = 'toggle-btns';
    const btnB = document.createElement('button');
    btnB.className = 't-btn';
    btnB.textContent = 'B';
    btnB.title = 'Basic';
    btnB.dataset.badgeId = badge.id;
    btnB.dataset.level = 'basic';
    btnB.addEventListener('click', () => BadgeState.toggleBadgeLevel(badge.id, 'basic'));
    tgs.appendChild(btnB);
    if (badge.adv !== false) {
      const btnA = document.createElement('button');
      btnA.className = 't-btn';
      btnA.textContent = 'A';
      btnA.title = 'Advanced (red cloth backing)';
      btnA.dataset.badgeId = badge.id;
      btnA.dataset.level = 'advanced';
      btnA.addEventListener('click', () => BadgeState.toggleBadgeLevel(badge.id, 'advanced'));
      tgs.appendChild(btnA);
    }
    row.append(thumb, nm, tgs);
    parent.appendChild(row);
  }

  function checkRow(label, note, dataset, handler, parent) {
    const row = document.createElement('div');
    row.className = 'chk-row';
    Object.assign(row.dataset, dataset);
    const cb = document.createElement('div');
    cb.className = 'chk-box';
    Object.assign(cb.dataset, dataset);
    const lbl = document.createElement('div');
    lbl.className = 'chk-label';
    lbl.textContent = label;
    if (note) { const s = document.createElement('span'); s.className = 'chk-note'; s.textContent = note; lbl.appendChild(s); }
    row.append(cb, lbl);
    row.addEventListener('click', handler);
    parent.appendChild(row);
  }

  section('Compulsory Awards', bd => { COMPULSORY.forEach(b => badgeRow(b, bd)); });
  section('Electives – Interest (A)', bd => { groupLabel('Interest — Group A', bd); GROUP_A.forEach(b => badgeRow(b, bd)); }, true);
  section('Electives – Adventure (B)', bd => { groupLabel('Adventure — Group B', bd); GROUP_B.forEach(b => badgeRow(b, bd)); }, true);
  section('Electives – Community (C)', bd => { groupLabel('Community — Group C', bd); GROUP_C.forEach(b => badgeRow(b, bd)); }, true);
  section('Electives – Physical (D)', bd => { groupLabel('Physical — Group D', bd); GROUP_D.forEach(b => badgeRow(b, bd)); }, true);

  section('Rank', bd => {
    groupLabel('Select one — mutually exclusive', bd);
    const grid = document.createElement('div');
    grid.className = 'rank-grid';
    RANKS.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'rank-btn';
      btn.textContent = r;
      btn.dataset.rank = r;
      btn.addEventListener('click', () => BadgeState.setRank(r));
      grid.appendChild(btn);
    });
    bd.appendChild(grid);
  });

  section('Service Awards', bd => {
    checkRow('LINK BADGE', null, { serviceKey: 'link' }, () => BadgeState.toggleService('link'), bd);
    checkRow('JUNIOR SECTION SERVICE BADGE', null, { serviceKey: 'junior_section' }, () => BadgeState.toggleService('junior_section'), bd);
    const yr = document.createElement('div');
    yr.className = 'year-row';
    yr.innerHTML = `<span class="year-label">ONE YEAR SERVICE BADGE</span>
      <div class="stepper">
        <button class="step-btn" data-action="minus">−</button>
        <div class="step-val js-yr-val">0</div>
        <button class="step-btn" data-action="plus">+</button>
      </div>`;
    yr.querySelector('[data-action="minus"]').addEventListener('click', () =>
      BadgeState.setServiceYears(BadgeState.getState().service.one_year_count - 1));
    yr.querySelector('[data-action="plus"]').addEventListener('click', () =>
      BadgeState.setServiceYears(BadgeState.getState().service.one_year_count + 1));
    bd.appendChild(yr);
    checkRow('THREE YEAR SERVICE BADGE', null, { serviceKey: 'three_year' }, () => BadgeState.toggleService('three_year'), bd);
    checkRow('LONG YEAR SERVICE BADGE', null, { serviceKey: 'long_year' }, () => BadgeState.toggleService('long_year'), bd);
  });

  section('Special Awards', bd => {
    checkRow('NCO PROFICIENCY', 'Requires a Rank to be selected', { specialKey: 'nco_proficiency' }, () => BadgeState.toggleSpecial('nco_proficiency'), bd);
    checkRow('BRONZE SCHOLASTIC AWARD', null, { specialKey: 'bronze_scholastic' }, () => BadgeState.toggleSpecial('bronze_scholastic'), bd);
    checkRow('SILVER SCHOLASTIC AWARD', null, { specialKey: 'silver_scholastic' }, () => BadgeState.toggleSpecial('silver_scholastic'), bd);
    checkRow('GOLD SCHOLASTIC AWARD', null, { specialKey: 'gold_scholastic' }, () => BadgeState.toggleSpecial('gold_scholastic'), bd);
    checkRow('GOLD AWARD', null, { specialKey: 'gold_award' }, () => BadgeState.toggleSpecial('gold_award'), bd);
    const dr = document.createElement('div');
    dr.className = 'dofe-row';
    dr.innerHTML = `<span class="dofe-label">DUKE OF EDINBURGH</span>
      <div class="dofe-btns">
        <button class="dofe-btn" data-dofe="bronze">Bronze</button>
        <button class="dofe-btn" data-dofe="silver">Silver</button>
        <button class="dofe-btn" data-dofe="gold">Gold</button>
      </div>`;
    dr.querySelectorAll('.dofe-btn').forEach(btn =>
      btn.addEventListener('click', () => BadgeState.setDofe(btn.dataset.dofe)));
    bd.appendChild(dr);
    checkRow("PRESIDENT'S AWARD", 'Enabled when all 13 Journey criteria are met', { specialKey: 'presidents_award' }, () => BadgeState.toggleSpecial('presidents_award'), bd);
    checkRow("FOUNDER'S AWARD", "Requires President's Award to be checked", { specialKey: 'founders_award' }, () => BadgeState.toggleSpecial('founders_award'), bd);
  });
}

/* Sync sidebar UI to state */
function syncSidebar(s) {
  document.querySelectorAll('.t-btn[data-badge-id]').forEach(btn => {
    const { badgeId, level } = btn.dataset;
    if (!s.badges[badgeId]) return;
    btn.classList.toggle('on-b', level === 'basic' && !!s.badges[badgeId].basic);
    btn.classList.toggle('on-a', level === 'advanced' && !!s.badges[badgeId].advanced);
  });

  document.querySelectorAll('.rank-btn').forEach(btn =>
    btn.classList.toggle('on', btn.dataset.rank === s.rank));

  document.querySelectorAll('[data-service-key]').forEach(el => {
    const k = el.dataset.serviceKey;
    if (el.classList.contains('chk-box')) el.classList.toggle('on', !!s.service[k]);
  });
  document.querySelectorAll('.js-yr-val').forEach(el => el.textContent = s.service.one_year_count);

  document.querySelectorAll('[data-special-key]').forEach(el => {
    const k = el.dataset.specialKey;
    if (el.classList.contains('chk-box')) el.classList.toggle('on', s.special[k] === true);
    if (el.classList.contains('chk-row')) {
      const locked =
        (k === 'nco_proficiency' && !s.rank) ||
        (k === 'presidents_award' && !s.presidentsAwardUnlocked) ||
        (k === 'founders_award' && !s.special.presidents_award);
      el.classList.toggle('locked', locked);
    }
  });

  document.querySelectorAll('.dofe-btn').forEach(btn =>
    btn.classList.toggle('on', btn.dataset.dofe === s.special.dofe));

  /* Badge count — B+A = 1 */
  let total = 0;
  Object.values(s.badges).forEach(b => { if (b.basic || b.advanced) total++; });
  if (s.rank) total++;
  Object.entries(s.service).forEach(([k, v]) => { if (k !== 'one_year_count' && v === true) total++; });
  if (s.service.one_year_count > 0) total++;
  ['nco_proficiency', 'bronze_scholastic', 'silver_scholastic', 'gold_scholastic', 'gold_award', 'presidents_award', 'founders_award'].forEach(k => { if (s.special[k]) total++; });
  if (s.special.dofe) total++;
  document.querySelectorAll('.js-total-count').forEach(el => el.textContent = total);
}


/* ══════════════════════════════════════════════════════════
   04. COMPONENT 2 — BADGE ARRANGEMENT RENDERER
══════════════════════════════════════════════════════════ */
function chip(abbr, cls, title) {
  return `<div class="arm-chip ${cls}" title="${title}"><span class="arm-chip-txt">${abbr}</span></div>`;
}

/* Advanced mode is always ON */
function imgChip(src, title, isAdv) {
  if (isAdv) {
    return `<div class="red-cloths" title="${title}">
      <img class="badge-img" src="${src}" alt="${title}">
    </div>`;
  }
  return `<div class="badge-img-wrap" title="${title}">
    <img class="badge-img" src="${src}" alt="${title}">
  </div>`;
}

function leftImgChip(src, title, small = false, extraClass = '') {
  return `<div class="badge-img-wrap${small ? ' badge-img-sm' : ''}${extraClass ? ' ' + extraClass : ''}" title="${title}">
    <img class="badge-img" src="${src}" alt="${title}">
  </div>`;
}

function svgChevron() {
  return `<svg class="chevron-svg" viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0,10 L100,27 L200,10 L200,23 L100,40 L0,23 Z" fill="white"/>
  </svg>`;
}

function svgChevronPhone() {
  return `<svg class="chevron-svg-phone" viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M20,10 L100,38 L180,10 L180,20 L100,51 L20,20 Z" fill="white"/>
  </svg>`;
}

function renderArrangement(s) {
  /* ── Right arm ── */
  const rightBadges = ALL_PROF.filter(b => s.badges[b.id] && (s.badges[b.id].basic || s.badges[b.id].advanced));
  rightBadges.sort((a, b) => {
    if (a.id === 'target') return -1;
    if (b.id === 'target') return 1;
    return a.name.localeCompare(b.name);
  });

  let rightHTML = '';
  if (rightBadges.length === 0) {
    rightHTML = '<div class="arm-empty">No proficiency badges selected yet.</div>';
  } else {
    /* Always centred flex — naturally 5 per row on arm card width */
    rightHTML = '<div class="badge-grid-centered">';
    rightBadges.forEach(b => {
      const isAdv = !!s.badges[b.id].advanced;
      rightHTML += imgChip(RIGHT_IMAGES[b.id] || '', b.name + (isAdv ? ' (Advanced)' : ''), isAdv);
    });
    rightHTML += '</div>';
  }

  /* Handle arm card class and chevrons */
  const counts = { 'Lance Corporal': 1, 'Corporal': 2, 'Sergeant': 3, 'Staff Sergeant': 4 };
  const rankCount = counts[s.rank] || 0;
  const armCard = document.getElementById('arm-right');
  if (armCard) {
    // Remove old wrap if exists
    const oldWrap = armCard.querySelector('.chevron-wrap');
    if (oldWrap) oldWrap.remove();

    if (rankCount > 0) {
      armCard.classList.add('has-rank');

      const wrap = document.createElement('div');
      wrap.className = 'chevron-wrap';
      wrap.title = s.rank;
      
      const isMobile = window.innerWidth <= 1250;
      for (let i = 0; i < rankCount; i++) {
        wrap.innerHTML += isMobile ? svgChevronPhone() : svgChevron();
      }
      armCard.appendChild(wrap);
    } else {
      armCard.classList.remove('has-rank');
      armCard.style.minHeight = '320px'; // Standard Private height
    }
  }

  document.getElementById('arm-right-content').innerHTML = rightHTML;
  document.getElementById('arm-right-content').style.flex = '1'; // Pushes chevrons but keeps grid tidy

  const armsOuter = document.getElementById('arms-outer');
  // Layout logic is now handled in CSS via #arm-col-left align-self: start

  /* ── Left arm — structured rows ── */
  const sv = s.service;
  const sp = s.special;

  function leftRow(items, small = false, isFounderRow = false, isPresidentRow = false) {
    if (!items.length) return '';
    return `<div class="left-arm-row">${items.map(([src, t]) => {
      let extraClass = '';
      if (isFounderRow && t.includes("Founder")) extraClass = 'badge-img-xl';
      if (isPresidentRow && t.includes("President")) extraClass = 'badge-img-lg';
      return leftImgChip(src, t, small, extraClass);
    }).join('')}</div>`;
  }

  const r1 = [];
  if (sp.founders_award) r1.push([LEFT_IMAGES.founders_award, "Founder's Award"]);

  const r2 = [];
  if (sp.presidents_award) r2.push([LEFT_IMAGES.presidents_award, "President's Award"]);
  if (sp.gold_award) r2.push([LEFT_IMAGES.gold_award, 'Gold Award']);
  if (sp.dofe) r2.push([LEFT_IMAGES['dofe_' + sp.dofe] || '', 'Duke of Edinburgh – ' + sp.dofe]);

  const r3 = [];
  if (sp.gold_scholastic) r3.push([LEFT_IMAGES.gold_scholastic, 'Gold Scholastic Award']);
  if (sp.silver_scholastic) r3.push([LEFT_IMAGES.silver_scholastic, 'Silver Scholastic Award']);
  if (sp.bronze_scholastic) r3.push([LEFT_IMAGES.bronze_scholastic, 'Bronze Scholastic Award']);

  const r4 = [];
  if (sv.long_year) r4.push([LEFT_IMAGES.long_year, 'Long Year Service Badge']);
  if (sp.nco_proficiency) r4.push([LEFT_IMAGES.nco_proficiency, 'NCO Proficiency Star']);
  if (sv.three_year) r4.push([LEFT_IMAGES.three_year, 'Three Year Service Badge']);

  /* Row 5 — small badges to fit in one row */
  const r5 = [];
  if (sv.junior_section) r5.push([LEFT_IMAGES.junior_section, 'Junior Section Service Badge']);
  for (let i = 0; i < sv.one_year_count; i++) {
    r5.push([LEFT_IMAGES.one_year, `One Year Service Badge #${i + 1}`]);
  }

  const rows = [
    leftRow(r1, false, true),
    leftRow(r2, false, false, true),
    leftRow(r3),
    leftRow(r4),
    leftRow(r5, true)
  ].join('');
  document.getElementById('arm-left-content').innerHTML =
    rows || '<div class="arm-empty">No service or special awards selected.</div>';

  /* Link Badge below the arm card */
  const linkSlot = document.getElementById('arm-left-link');
  if (linkSlot) {
    linkSlot.innerHTML = sv.link
      ? `<div class="link-badge-below">${leftImgChip(LEFT_IMAGES.link, 'Link Badge')}`
      : '';
  }

}


/* ══════════════════════════════════════════════════════════
   05. COMPONENT 3 — BADGE SUMMARY RENDERER
══════════════════════════════════════════════════════════ */
function renderSummary(s) {
  let basicCount = 0, advCount = 0;
  Object.values(s.badges).forEach(b => { if (b.basic) basicCount++; if (b.advanced) advCount++; });
  const currentRank = s.rank || 'Private';

  document.getElementById('stat-row').innerHTML = `
    <div class="stat-card"><div class="stat-num stat-rank-text">${currentRank}</div><div class="stat-lbl">Current Rank</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--gold)">${basicCount}</div><div class="stat-lbl">Basic Badges</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--red-adv)">${advCount}</div><div class="stat-lbl">Advanced Badges</div></div>`;

  /* Rank progression */
  const rankOrder = ['Private', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant'];
  const rankIdx = rankOrder.indexOf(currentRank);
  document.getElementById('rank-progression').innerHTML = `
    <div class="rank-prog-wrap">
      <div class="rank-prog-label">Rank Progression</div>
      <div class="rank-prog-track">
        ${rankOrder.map((r, i) => `<div class="rank-prog-step ${i <= rankIdx ? 'achieved' : ''}">${r}</div>`).join('')}
      </div>
    </div>`;

  function catCard(name, checked, total, allBadges, earnedSet) {
    const pct = total ? Math.min(100, Math.round(checked / total * 100)) : 0;
    const full = checked >= total && total > 0;

    let chipsHTML = '';
    if (allBadges && earnedSet) {
      chipsHTML = '<div class="badge-chips-row">' +
        allBadges.map(b => {
          const earned = earnedSet.has(b.id);
          const isAdv = s.badges && s.badges[b.id] ? s.badges[b.id].advanced : false;

          let chipClass = 'chip-missing';
          if (earned) {
            chipClass = 'chip-earned';
            // Advanced red styling, except Target, Service, and Special which stay green
            if (isAdv && b.id !== 'target' && b.grp !== 'svc' && b.grp !== 'spl') {
              chipClass += ' red-chip';
            }
          }

          const src = b.isLeft ? LEFT_IMAGES[b.imgKey] : (RIGHT_IMAGES[b.id] || '');
          const badgeTitle = b.name + (isAdv && b.id !== 'target' && b.grp !== 'svc' && b.grp !== 'spl' ? ' (Advanced)' : '');
          const labelSuffix = isAdv && b.id !== 'target' && b.grp !== 'svc' && b.grp !== 'spl' ? ' ★' : '';

          return `<div class="summary-badge-chip ${chipClass}" title="${badgeTitle}">
            <img src="${src}" alt="${b.name}" class="chip-img">
            <span class="chip-lbl">${b.name}${labelSuffix}</span>
          </div>`;
        }).join('') +
        '</div>';
    }

    return `<div class="cat-card">
      <div class="cat-hd">
        <span class="cat-name">${name}</span>
        <span class="cat-frac ${full ? 'frac-full' : ''}">${checked}/${total}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill${full ? ' full' : ''}" style="width:${pct}%"></div></div>
      ${full ? '<div class="all-done">✓ Complete</div>' : ''}
      ${chipsHTML}
    </div>`;
  }

  // Proficiency Badges Setup
  const compEarned = new Set(COMPULSORY.filter(b => s.badges[b.id].basic || s.badges[b.id].advanced).map(b => b.id));
  const gAEarned = new Set(GROUP_A.filter(b => s.badges[b.id].basic || s.badges[b.id].advanced).map(b => b.id));
  const gBEarned = new Set(GROUP_B.filter(b => s.badges[b.id].basic || s.badges[b.id].advanced).map(b => b.id));
  const gCEarned = new Set(GROUP_C.filter(b => s.badges[b.id].basic || s.badges[b.id].advanced).map(b => b.id));
  const gDEarned = new Set(GROUP_D.filter(b => s.badges[b.id].basic || s.badges[b.id].advanced).map(b => b.id));

  // Service Awards Setup
  let svcCount = 0;
  const svcEarned = new Set();
  const sv = s.service || {};
  if (sv.junior_section) { svcCount++; svcEarned.add('junior_section'); }
  if (sv.three_year) { svcCount++; svcEarned.add('three_year'); }
  if (sv.long_year) { svcCount++; svcEarned.add('long_year'); }
  if (sv.one_year_count > 0) {
    svcCount += Math.min(2, sv.one_year_count); // Ensure it doesn't overflow 5 limit in total easily, or count exactly user input
    svcEarned.add('one_year');
  }
  svcCount = Math.min(5, svcCount);

  // Special Awards Setup
  let splCount = 0;
  const splEarned = new Set();
  const sp = s.special || {};
  if (sp.founders_award) { splCount++; splEarned.add('founders_award'); }
  if (sp.presidents_award) { splCount++; splEarned.add('presidents_award'); }
  if (sp.gold_award) { splCount++; splEarned.add('gold_award'); }
  if (sp.dofe) { splCount++; splEarned.add('dofe'); }
  if (sp.bronze_scholastic) { splCount++; splEarned.add('bronze_scholastic'); }
  if (sp.silver_scholastic) { splCount++; splEarned.add('silver_scholastic'); }
  if (sp.gold_scholastic) { splCount++; splEarned.add('gold_scholastic'); }
  if (sp.nco_proficiency) { splCount++; splEarned.add('nco_proficiency'); }
  splCount = Math.min(8, splCount);

  const SVCBadgeDefs = BADGE_REQS.filter(b => b.grp === 'svc');
  const SPLBadgeDefs = BADGE_REQS.filter(b => b.grp === 'spl' && b.id !== 'link'); // Ignore link badge for stats out of 8

  document.getElementById('summary-cats').innerHTML =
    catCard('Compulsory Awards', compEarned.size, COMPULSORY.length, COMPULSORY, compEarned) +
    catCard('Group A – Interest', gAEarned.size, GROUP_A.length, GROUP_A, gAEarned) +
    catCard('Group B – Adventure', gBEarned.size, GROUP_B.length, GROUP_B, gBEarned) +
    catCard('Group C – Community', gCEarned.size, GROUP_C.length, GROUP_C, gCEarned) +
    catCard('Group D – Physical', gDEarned.size, GROUP_D.length, GROUP_D, gDEarned) +
    catCard('Service Awards', svcCount, 5, SVCBadgeDefs, svcEarned) +
    catCard('Special Awards', splCount, 8, SPLBadgeDefs, splEarned);
}


/* ══════════════════════════════════════════════════════════
   06. COMPONENT 4 — JOURNEY TO PRESIDENT RENDERER
══════════════════════════════════════════════════════════ */
let _prevPresidentsUnlocked = false;

// Puzzle Coordinates & State
const SHARD_PTS = [
  "0,0 130,0 114,61 72,101 0,74",
  "130,0 260,0 260,67 187,88 114,61",
  "0,74 72,101 46,162 0,142",
  "114,61 187,88 177,156 110,142 72,101",
  "260,67 260,170 214,150 177,156 187,88",
  "0,142 46,162 26,217 0,204",
  "72,101 110,142 125,210 78,237 26,217 46,162",
  "110,142 177,156 214,150 228,216 177,258 125,210",
  "214,150 260,170 260,264 228,216",
  "0,204 26,217 78,237 68,291 0,277",
  "78,237 125,210 177,258 228,216 213,305 141,325 68,291",
  "228,216 260,264 260,340 197,340 213,305",
  "0,277 68,291 141,325 213,305 197,340 0,340"
];
let journeyPolys = [];
let puzzleState = Array(13).fill(false); // Tracks which pieces are currently visible

function initJourneyPuzzle() {
  const svg = document.getElementById('shard-svg');
  SHARD_PTS.forEach((pts) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    p.setAttribute('points', pts);
    p.classList.add('locked');
    svg.appendChild(p);
    journeyPolys.push(p);
  });
}

function computeCriteria(s) {
  const b = s.badges;
  const bav = id => b[id] && (b[id].basic || b[id].advanced);
  const any = arr => arr.some(x => b[x.id] && (b[x.id].basic || b[x.id].advanced));

  const ceVal = b.christian_ed && b.christian_ed.advanced ? 2 : (b.christian_ed && b.christian_ed.basic ? 1 : 0);
  const drillVal = b.drill && b.drill.advanced ? 2 : (b.drill && b.drill.basic ? 1 : 0);

  const basicTotal = ALL_PROF.filter(x => b[x.id] && b[x.id].basic).length;
  const advTotal = ALL_PROF.filter(x => b[x.id] && b[x.id].advanced).length;

  const crits = [
    {
      n: 1, key: 'target', name: 'Target', img: RIGHT_IMAGES.target,
      group: 'comp', val: b.target && b.target.basic ? 1 : 0, max: 1
    },
    {
      n: 2, key: 'christian_ed', name: 'Christian Education', img: RIGHT_IMAGES.christian_ed,
      group: 'comp', val: ceVal, max: 2, hint: 'Basic = 1/2, Advanced = 2/2'
    },
    {
      n: 3, key: 'drill', name: 'Drill', img: RIGHT_IMAGES.drill,
      group: 'comp', val: drillVal, max: 2, hint: 'Basic = 1/2, Advanced = 2/2'
    },
    {
      n: 4, key: 'recruitment', name: 'Recruitment', img: RIGHT_IMAGES.recruitment,
      group: 'comp', val: bav('recruitment') ? 1 : 0, max: 1
    },
    {
      n: 5, key: 'nco_prof', name: 'NCO Proficiency', img: LEFT_IMAGES.nco_proficiency,
      group: 'nco', val: s.special.nco_proficiency ? 1 : 0, max: 1
    },
    {
      n: 6, key: 'three_year', name: 'Three Year Service', img: LEFT_IMAGES.three_year,
      group: 'rs', val: s.service.three_year ? 1 : 0, max: 1
    },
    {
      n: 7, key: 'basic6', name: '6 of Basic Proficiency Award', img: 'image/President/6.png',
      group: 'rs', val: Math.min(basicTotal, 6), max: 6
    },
    {
      n: 8, key: 'adv4', name: '4 of Advanced Proficiency Award', img: 'image/President/4.png',
      group: 'rs', val: Math.min(advTotal, 4), max: 4
    },
    {
      n: 9, key: 'grpa', name: 'Interest (Group A)', img: 'image/President/a.png',
      group: 'group', val: any(GROUP_A) ? 1 : 0, max: 1
    },
    {
      n: 10, key: 'grpb', name: 'Adventure (Group B)', img: 'image/President/b.png',
      group: 'group', val: any(GROUP_B) ? 1 : 0, max: 1
    },
    {
      n: 11, key: 'grpc', name: 'Community (Group C)', img: 'image/President/c.png',
      group: 'group', val: any(GROUP_C) ? 1 : 0, max: 1
    },
    {
      n: 12, key: 'grpd', name: 'Physical (Group D)', img: 'image/President/d.png',
      group: 'group', val: any(GROUP_D) ? 1 : 0, max: 1
    },
    {
      n: 13, key: 'rank', name: 'NCO in the Company', img: 'image/President/N.png',
      group: 'nco', val: s.rank ? 1 : 0, max: 1
    },
  ];

  crits.forEach(c => { c.met = c.val >= c.max; });
  return crits;
}



function renderJourney(s) {
  const crits = computeCriteria(s);
  const metCount = crits.filter(c => c.met).length;
  const allMet = metCount === 13;
  const pct = Math.round(metCount / 13 * 100);

  const recentlyUnlocked = allMet && !_prevPresidentsUnlocked;
  const recentlyLocked = !allMet && _prevPresidentsUnlocked;
  _prevPresidentsUnlocked = allMet;

  if (recentlyUnlocked) BadgeState.setPresidentsAwardUnlocked(true);
  else if (recentlyLocked) BadgeState.setPresidentsAwardUnlocked(false);

  document.getElementById('journey-subtitle').textContent = `${metCount} of 13 criteria met`;
  document.getElementById('journey-fill').style.width = `${pct}%`;
  document.getElementById('journey-pct').textContent = `${pct}%`;
  document.getElementById('celebrate').classList.toggle('show', allMet);

  // 🧩 Update the Puzzle Visuals based on the criteria array
  crits.forEach((c, i) => {
    const p = journeyPolys[i];
    if (!p) return;

    if (c.met && !puzzleState[i]) {
      puzzleState[i] = true;
      p.classList.remove('locked');
      p.classList.add('flash');
      setTimeout(() => p.classList.remove('flash'), 600);
      p.classList.add('unlocked');
    } else if (!c.met && puzzleState[i]) {
      puzzleState[i] = false;
      p.classList.remove('unlocked', 'flash');
      p.classList.add('locked');
    }
  });
  document.getElementById('card-wrap').classList.toggle('evolved', allMet);

  // 🛠️ Smart DOM Update: Only modify what changed so the animation doesn't pop up constantly
  const grid = document.getElementById('criteria-grid');
  const existingCards = grid.querySelectorAll('.crit-card');

  if (existingCards.length === 0) {
    // 1st Time Render: Build the whole HTML structure
    grid.innerHTML = crits.map((c) => {
      const partial = c.val > 0 && !c.met;
      const cls = c.met ? `crit-card crit-met` : (partial ? `crit-card crit-partial` : 'crit-card crit-locked');
      const pctVal = Math.round(c.val / c.max * 100);

      return `<div class="${cls}" title="${c.hint || ''}">
        <img class="crit-badge-img" src="${c.img}" alt="${c.name}">
        <div class="crit-name">${c.name}</div>
        <div class="crit-progress-row">
          <div class="crit-mini-bar"><div class="crit-mini-fill" style="width:${pctVal}%"></div></div>
          <span class="crit-fraction">${c.val}/${c.max} (${pctVal}%)</span>
        </div>
      </div>`;
    }).join('');
  } else {
    // Subsequent Renders: Just update classes and text values to prevent flashing
    crits.forEach((c, i) => {
      const card = existingCards[i];
      if (!card) return;

      const partial = c.val > 0 && !c.met;
      const newCls = c.met ? `crit-card crit-met` : (partial ? `crit-card crit-partial` : 'crit-card crit-locked');

      // Update card state (triggers animation ONLY if the class actually changed)
      if (card.className !== newCls) {
        card.className = newCls;
      }

      // Update progress bar width
      const pctVal = Math.round(c.val / c.max * 100);
      const fill = card.querySelector('.crit-mini-fill');
      if (fill.style.width !== `${pctVal}%`) {
        fill.style.width = `${pctVal}%`;
      }

      // Update fraction text (e.g., 0/1 to 1/1)
      const fractionText = `${c.val}/${c.max} (${pctVal}%)`;
      const fractionEl = card.querySelector('.crit-fraction');
      if (fractionEl.textContent !== fractionText) {
        fractionEl.textContent = fractionText;
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════
   07. COMPONENT 5 — BADGE REQUIREMENTS RENDERER
══════════════════════════════════════════════════════════ */
function iconClass(grp) {
  return { comp: 'ic-comp', grpa: 'ic-grpa', grpb: 'ic-grpb', grpc: 'ic-grpc', grpd: 'ic-grpd' }[grp] || 'ic-comp';
}
function badgeAbbr(name) {
  const words = name.split(' ');
  return (words.length === 1 ? name.slice(0, 3) : words.map(w => w[0]).join('')).slice(0, 3);
}

let currentReqsList = [];
let currentReqIndex = 0;

function openReqModal(index) {
  if (index < 0 || index >= currentReqsList.length) return;
  currentReqIndex = index;
  const b = currentReqsList[index];

  const imgUrl = b.isLeft ? LEFT_IMAGES[b.imgKey] : RIGHT_IMAGES[b.id];

  const renderLi = (reqs) => {
    return reqs.map(r => {
      if (r.startsWith('  - ')) {
        return `<li class="sub-req">${r.substring(4)}</li>`;
      }
      return `<li>${r}</li>`;
    }).join('');
  };

  let basicHTML = '';
  if (b.basic && b.basic.length) {
    basicHTML = `
      <div class="req-modal-section">
        <h4>Basic Requirements:</h4>
        <ul>${renderLi(b.basic)}</ul>
      </div>`;
  }

  let advHTML = '';
  if (b.advanced && b.advanced.length) {
    advHTML = `
      <div class="req-modal-section adv-sec">
        <h4>Advanced Requirements:</h4>
        <ul>${renderLi(b.advanced)}</ul>
      </div>`;
  }

  // If both empty (like Service awards)
  if (!basicHTML && !advHTML) {
    basicHTML = `
      <div class="req-modal-section">
        <h4>Requirements:</h4>
        <ul><li>Awarded upon fulfilling the specific service duration or special criteria as stipulated by Boys' Brigade regulations.</li></ul>
      </div>`;
  }

  document.getElementById('req-modal-content').innerHTML = `
    <div class="req-modal-header">
      <img class="req-modal-img" src="${imgUrl || ''}" alt="${b.name}">
      <div class="req-modal-title">${b.name}</div>
    </div>
    ${basicHTML}
    ${advHTML}
  `;

  document.getElementById('req-modal').classList.add('show');
}

function closeReqModal() {
  document.getElementById('req-modal').classList.remove('show');
}

document.getElementById('req-modal-close').addEventListener('click', closeReqModal);
document.getElementById('req-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('req-modal')) closeReqModal();
});
document.getElementById('req-prev').addEventListener('click', () => openReqModal(currentReqIndex - 1));
document.getElementById('req-next').addEventListener('click', () => openReqModal(currentReqIndex + 1));

function renderRequirements() {
  const query = document.getElementById('bdg-search').value.toLowerCase();
  const cat = document.getElementById('cat-filter').value;
  const lv = document.getElementById('lv-filter').value;

  currentReqsList = BADGE_REQS.filter(b => {
    if (query && !b.name.toLowerCase().includes(query) && !b.cat.toLowerCase().includes(query)) return false;
    if (cat && b.cat !== cat) return false;
    if (lv === 'basic' && b.adv) return false;
    if (lv === 'advanced' && !b.adv) return false;
    return true;
  });

  const grid = document.getElementById('badge-req-grid');
  const noRes = document.getElementById('no-results');
  noRes.style.display = currentReqsList.length ? 'none' : 'block';

  grid.innerHTML = currentReqsList.map((b, idx) => {
    const imgUrl = b.isLeft ? LEFT_IMAGES[b.imgKey] : RIGHT_IMAGES[b.id];
    return `
      <div class="bdg-req-card" data-idx="${idx}">
        <img src="${imgUrl || ''}" class="req-card-img" alt="${b.name}">
        <div class="bdg-req-name">${b.name}</div>
        <div class="bdg-req-cat">${b.cat}</div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.bdg-req-card').forEach(card => {
    card.addEventListener('click', () => openReqModal(+card.dataset.idx));
  });
}

document.getElementById('bdg-search').addEventListener('input', renderRequirements);
document.getElementById('cat-filter').addEventListener('change', renderRequirements);
document.getElementById('lv-filter').addEventListener('change', renderRequirements);


/* ══════════════════════════════════════════════════════════
   08. COMPONENT 6 — BB RESOURCES BUILDER
══════════════════════════════════════════════════════════ */
function openSongModal(index) {
  const s = SONGS[index];
  document.getElementById('song-modal-content').innerHTML = `
    <div class="req-modal-header">
      <div class="req-modal-title">${s.title}</div>
    </div>
    <div class="req-modal-section">
      <div class="song-text-popup">${s.lyrics}</div>
      <div class="song-note-popup">${s.note}</div>
    </div>
  `;
  document.getElementById('song-modal').classList.add('show');
}

function closeSongModal() {
  document.getElementById('song-modal').classList.remove('show');
}

document.getElementById('song-modal-close').addEventListener('click', closeSongModal);
document.getElementById('song-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('song-modal')) closeSongModal();
});

function buildResources() {
  document.getElementById('song-grid').innerHTML = SONGS.map((s, idx) => `
    <div class="song-res-card" onclick="openSongModal(${idx})">
      <div class="song-res-info">
        <div class="song-res-title">${s.title}</div>
        <div class="song-res-note">${s.note}</div>
      </div>
      <div class="song-res-icon">🎵</div>
    </div>
  `).join('');

  document.getElementById('bugle-grid').innerHTML = BUGLE_CALLS.map(bc => `
    <div class="bugle-card">
      <div class="bugle-main">
        <div class="bugle-name">${bc.name}</div>
        <div class="bugle-desc">${bc.desc}</div>
        <div class="bugle-time">${bc.time}</div>
      </div>
      <div class="bugle-player">
        <button class="bugle-play-btn" disabled title="Recording coming soon">
          <i class="fa-solid fa-play"></i> Coming Soon
        </button>
      </div>
    </div>`).join('');
  document.getElementById('dl-grid').innerHTML = DOWNLOADS.map(d => `
    <div class="dl-card">
      <div class="dl-icon">${d.icon}</div>
      <div class="dl-info">
        <div class="dl-name">${d.name}</div>
        <div class="dl-size">${d.size}</div>
      </div>
      <button class="dl-btn">View</button>
    </div>`).join('');
}





/* ══════════════════════════════════════════════════════════
   11. SHARED: MASTER RENDER + TAB NAV + MOBILE SHEET
══════════════════════════════════════════════════════════ */

function render(state) {
  syncSidebar(state);
  renderArrangement(state);
  renderSummary(state);
  renderJourney(state);
}

/* Tab navigation (Sync desktop and bottom mobile nav) */
document.querySelectorAll('.tab-btn, .bottom-nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // Update active class for all controls (Top & Bottom)
    document.querySelectorAll('.tab-btn, .bottom-nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });

    // Show correct section
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'tab-' + tabId);
    });

    document.body.dataset.activeTab = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when switching
  });
});

/* Mobile bottom sheet — open / close */
function openSheet() {
  const ov = document.getElementById('overlay');
  const sh = document.getElementById('sheet');
  ov.style.display = 'block';
  requestAnimationFrame(() => { ov.style.opacity = '1'; sh.classList.add('open'); });
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  const ov = document.getElementById('overlay');
  const sh = document.getElementById('sheet');
  ov.style.opacity = '0';
  sh.classList.remove('open');
  setTimeout(() => { ov.style.display = 'none'; document.body.style.overflow = ''; }, 360);
}

document.getElementById('fab').addEventListener('click', openSheet);
document.getElementById('close-btn').addEventListener('click', closeSheet);
document.getElementById('overlay').addEventListener('click', closeSheet);
document.getElementById('reset-btn').addEventListener('click', () => BadgeState.reset());

/* Sheet drag-to-close */
(function sheetDrag() {
  const sh = document.getElementById('sheet');
  const handle = document.getElementById('sheet-handle');
  const topbar = sh.querySelector('.sheet-topbar');
  const body = document.getElementById('sheet-body');
  
  let startY = 0, currentY = 0, dragging = false;

  function onTouchStart(e) {
    // Don't drag if we are clicking the actual close button
    if (e.target.closest('#close-btn')) return;
    
    // If touching the body, only allow drag-to-close if at the very top
    if (e.target.closest('#sheet-body') && body.scrollTop > 0) return;

    startY = e.touches[0].clientY;
    currentY = startY;
    dragging = true;
    sh.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!dragging) return;
    currentY = e.touches[0].clientY;
    const dy = Math.max(0, currentY - startY);
    
    // If dragging from the body and trying to scroll UP, cancel drag to allow normal scrolling
    if (currentY < startY) {
      dragging = false;
      sh.style.transition = '';
      sh.style.transform = '';
      return;
    }

    // If we are at top of list and dragging DOWN, pull the sheet
    if (dy > 0) {
      // If we are on the body, prevent default scrolling to drag the sheet instead
      if (e.target.closest('#sheet-body')) {
        // We can't actually preventDefault because listener is passive, 
        // but since dy > 0 and we are at top, the browser won't scroll anyway.
      }
      sh.style.transform = `translateY(${dy}px)`;
    }
  }

  function onTouchEnd() {
    if (!dragging) return;
    dragging = false;
    sh.style.transition = '';
    sh.style.transform = '';
    
    // Threshold to close is 120px
    if (currentY - startY > 120) {
      closeSheet();
    }
  }

  // Allow dragging from handle, topbar, and the body (if at top)
  handle.addEventListener('touchstart', onTouchStart, { passive: true });
  topbar.addEventListener('touchstart', onTouchStart, { passive: true });
  body.addEventListener('touchstart', onTouchStart, { passive: true });
  
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);
})();

/* Sidebar close / reopen */
const sidebarEl = document.getElementById('sidebar');
const sidebarOpen = document.getElementById('sidebar-open');
document.getElementById('sidebar-close').addEventListener('click', () => {
  sidebarEl.classList.add('hidden');
  sidebarOpen.style.display = 'flex';
  document.getElementById('main').classList.add('sidebar-hidden');
});
sidebarOpen.addEventListener('click', () => {
  sidebarEl.classList.remove('hidden');
  sidebarOpen.style.display = 'none';
  document.getElementById('main').classList.remove('sidebar-hidden');
});

// Mobile Header Logo click to HD
const mobLogo = document.getElementById('mobile-header-logo');
if (mobLogo) {
  mobLogo.addEventListener('click', () => {
    document.getElementById('hd-logo-popup').classList.add('show');
  });
}
document.getElementById('hd-logo-popup')?.addEventListener('click', () => {
  document.getElementById('hd-logo-popup').classList.remove('show');
});

/* Mobile arm segment toggle (Right / Left / Both) */
document.querySelectorAll('.seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const outer = document.getElementById('arms-outer');
    outer.dataset.armView = btn.dataset.arm;
  });
});

/* Info modal */
document.getElementById('arm-info-btn').addEventListener('click', () =>
  document.getElementById('arm-info-modal').classList.add('open'));
document.getElementById('arm-info-close').addEventListener('click', () =>
  document.getElementById('arm-info-modal').classList.remove('open'));
document.getElementById('arm-info-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('arm-info-modal'))
    document.getElementById('arm-info-modal').classList.remove('open');
});

/* Journey syllabus modal */
document.getElementById('journey-info-btn').addEventListener('click', () =>
  document.getElementById('journey-syllabus-modal').classList.add('open'));
document.getElementById('journey-syllabus-close').addEventListener('click', () =>
  document.getElementById('journey-syllabus-modal').classList.remove('open'));
document.getElementById('journey-syllabus-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('journey-syllabus-modal'))
    document.getElementById('journey-syllabus-modal').classList.remove('open');
});

/* ══════════════════════════════════════════════════════════
   MINI GAMES — 9 GAME HUB
══════════════════════════════════════════════════════════ */

/* ─── Shared Badge Pool (all mini-games use real badge images) ─── */
const BADGE_POOL = Object.keys(RIGHT_IMAGES); // All badge ids
// Pick `n` unique badge ids randomly per game session
function getGameBadges(n) { return arrShuffle(BADGE_POOL).slice(0, n); }
function badgeImg(id) { return RIGHT_IMAGES[id] || Object.values(RIGHT_IMAGES)[0]; }

// Legacy symbol array kept for any backward compat references
const GAME_SYMBOLS = ['⚓', '🎖', '📯', '🥁', '🏅', '🎗', '🧭', '🏕', '⛺', '🎪'];
const TILE_COLORS = ['#FF5C5C', '#4ECDC4', '#FFD166', '#6BCF7F', '#BF7FFF', '#4B9FFF', '#FF9F43', '#FF6BB5', '#00CED1', '#A8E063'];
const TILE_DARK = ['#b33030', '#259e96', '#c09800', '#38944d', '#7c30d4', '#1a5ec9', '#c46700', '#c02878', '#008b8d', '#619c20'];
const TILE_TEXT = ['#fff', '#fff', '#2a2000', '#fff', '#fff', '#fff', '#fff', '#fff', '#002a2b', '#1a3000'];


function arrShuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function showGameResult(el, win, title, sub, onReplay, currentLvl, onNext) {
  el.style.display = 'block';
  el.className = `game-result ${win ? 'win' : 'lose'}`;

  // Clean up previous buttons if any
  el.innerHTML = `
    <div class="game-result-title">${win ? '🏆' : '💔'} ${title}</div>
    <div class="game-result-sub">${sub}</div>
    <div class="game-result-btns">
      ${(win && currentLvl < 3 && onNext) ? '<button class="game-btn" id="gr-next">➡ Next Level</button>' : ''}
      <button class="game-btn ${win && currentLvl < 3 && onNext ? 'ghost' : ''}" id="gr-replay">🔄 Play Again</button>
      <button class="game-btn ghost" id="gr-lobby">🏠 Lobby</button>
    </div>`;

  if (win && currentLvl < 3 && onNext) {
    el.querySelector('#gr-next').addEventListener('click', () => { el.style.display = 'none'; onNext(); });
  }
  el.querySelector('#gr-replay').addEventListener('click', () => { el.style.display = 'none'; onReplay(); });
  el.querySelector('#gr-lobby').addEventListener('click', () => {
    el.style.display = 'none';
    exitGame(); // Standardized exit
  });
}

function askConfirm(msg, onYes) {
  const modal = document.getElementById('confirm-modal');
  const msgEl = document.getElementById('confirm-modal-msg');
  msgEl.textContent = msg;
  modal.classList.add('open');

  const yesBtn = document.getElementById('confirm-yes');
  const noBtn = document.getElementById('confirm-no');

  const cleanup = () => {
    modal.classList.remove('open');
    yesBtn.onclick = null;
    noBtn.onclick = null;
  };

  yesBtn.onclick = () => { cleanup(); onYes(); };
  noBtn.onclick = () => { cleanup(); };
}

function setupLvlPills(containerId, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.lvl-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const gv = container.closest('.game-view');
      const shouldAsk = activeGameId && activeGameId === gv.id;

      const proceed = () => {
        container.querySelectorAll('.lvl-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        callback(parseInt(btn.dataset.lvl));
      };

      if (shouldAsk) {
        askConfirm("Are you sure you want to quit? Your progress will be lost.", proceed);
      } else {
        proceed();
      }
    });
  });
}

/* ─── Game Routing ─── */
function showGameView(id) {
  document.querySelectorAll('.game-view').forEach(g => g.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function resetLvlPills(containerId, lvl) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.lvl-pill').forEach(b => b.classList.remove('active'));
  const btn = container.querySelector(`[data-lvl="${lvl}"]`);
  if (btn) btn.classList.add('active');
}

// Lobby picks
const GAME_MAP = {
  'pick-sheep': () => { showGameView('gv-sheep'); sheepInit(1); },
  'pick-badgematch': () => { showGameView('gv-badgematch'); bmInit(1); },
  'pick-drift': () => { showGameView('gv-drift'); driftInit(1); },
  'pick-sash': () => { showGameView('gv-sash'); sashInit(1); },
  'pick-seqmem': () => { showGameView('gv-seqmem'); seqInit(1); },
  'pick-puzzle': () => { showGameView('gv-puzzle'); initPuzzle(); },
};

Object.entries(GAME_MAP).forEach(([id, fn]) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', fn);
});

let activeGameId = null;
let isPaused = false;

// Back buttons with confirmation
function initBackButtons() {
  document.querySelectorAll('.game-back-btn').forEach(btn => {
    btn.onclick = () => {
      const gameId = btn.getAttribute('data-back');
      if (activeGameId && activeGameId === gameId) {
        askConfirm("Are you sure you want to quit? Your progress will be lost.", () => {
          exitGame();
        });
      } else {
        exitGame();
      }
    };
  });
}
initBackButtons();

function showQuitModal(gameId) {
  askConfirm("Are you sure you want to quit? Your progress will be lost.", () => {
    exitGame();
  });
}

function exitGame() {
  // Stop all timers
  if (sheepState && sheepState.timer) clearInterval(sheepState.timer);
  if (bmState && bmState.timer) clearInterval(bmState.timer);
  if (driftState && driftState.timer) clearInterval(driftState.timer);
  if (sashState && sashState.timer) clearInterval(sashState.timer);
  if (pz && pz.timer) clearInterval(pz.timer);
  if (seqState && seqState.ansTimer) clearInterval(seqState.ansTimer);

  activeGameId = null;
  isPaused = false;
  document.querySelectorAll('.game-view').forEach(gv => gv.classList.remove('paused'));
  showGameView('gv-select');
}

function togglePause(gameId) {
  const gv = document.getElementById(gameId);
  if (!gv) return;

  isPaused = !isPaused;
  if (isPaused) {
    gv.classList.add('paused');
    // Global pause logic could go here if needed
  } else {
    gv.classList.remove('paused');
  }

  // Update button text if applicable
  const startBtn = gv.querySelector('[id$="-start-btn"]') ||
    gv.querySelector('[id$="-new-btn"]') ||
    gv.querySelector('#pz-new');
  if (startBtn) {
    if (isPaused) {
      if (startBtn.id.includes('start-btn')) {
        startBtn.innerHTML = '▶ Resume';
        startBtn.classList.remove('ghost');
      }
    } else {
      if (startBtn.id.includes('start-btn')) {
        startBtn.innerHTML = '⏸ Pause';
        startBtn.classList.add('ghost');
      }
    }
  }
}

// Helper to add +10 points
// Helper to add +10 points
function addGamePoints(game, amount = 10) {
  // Amount defaults to 10 as per user request
  // This can be expanded to update global coins/xp if needed
  return amount;
}


/* ══════════════════════════════════════════════════════════
   GAME 1: SHEEP PUZZLE (Triple-Tile / Zen Match Style)
══════════════════════════════════════════════════════════ */
const SHEEP_TS = 64;
const SHEEP_STEP = 82;

const SHEEP_CFG = {
  1: { label: 'Easy', stars: 1, items: 6, slots: 7, undo: 5, shuffle: 5, time: 120, layers: [{ c: 5, r: 4, ox: 0, oy: 0 }, { c: 4, r: 3, ox: SHEEP_STEP / 2, oy: SHEEP_STEP / 2 }, { c: 2, r: 2, ox: SHEEP_STEP, oy: SHEEP_STEP }] },
  2: { label: 'Medium', stars: 2, items: 8, slots: 7, undo: 4, shuffle: 4, time: 180, layers: [{ c: 6, r: 4, ox: 0, oy: 0 }, { c: 4, r: 4, ox: SHEEP_STEP / 2, oy: 0 }, { c: 2, r: 4, ox: SHEEP_STEP, oy: 0 }] },
  3: { label: 'Hard', stars: 3, items: 10, slots: 6, undo: 3, shuffle: 3, time: 240, layers: [{ c: 7, r: 4, ox: 0, oy: 0 }, { c: 5, r: 4, ox: SHEEP_STEP / 2, oy: 0 }, { c: 3, r: 4, ox: SHEEP_STEP, oy: 0 }] },
};

let sheepState = {
  tiles: [], slots: [], history: [], matching: null, lvl: 1, shaking: false,
  timer: null, secs: 0, undoRem: 0, shuffRem: 0, active: false
};

function sheepPickItems(count) {
  const keys = Object.keys(RIGHT_IMAGES);
  return arrShuffle(keys).slice(0, count);
}

function sheepMakeTiles(lvl) {
  const cfg = SHEEP_CFG[lvl];
  const items = sheepPickItems(cfg.items);
  const pool = arrShuffle(items.flatMap(item => Array(6).fill(item)));
  let id = 0; const tiles = [];
  cfg.layers.forEach(({ c, r, ox, oy }, z) => {
    for (let row = 0; row < r; row++) {
      for (let col = 0; col < c; col++) {
        tiles.push({ id, item: pool[id], x: ox + col * SHEEP_STEP, y: oy + row * SHEEP_STEP, z, alive: true });
        id++;
      }
    }
  });
  return tiles;
}

function sheepOverlaps(a, b) { return Math.abs(a.x - b.x) < SHEEP_TS && Math.abs(a.y - b.y) < SHEEP_TS; }
function sheepBlocked(tile, all) { return all.some(t => t.alive && t.id !== tile.id && t.z > tile.z && sheepOverlaps(tile, t)); }

function sheepBoardSize(lvl) {
  const base = SHEEP_CFG[lvl].layers[0];
  const isMobile = window.innerWidth < 480;
  const ts = isMobile ? 40 : SHEEP_TS;
  const step = isMobile ? 44 : SHEEP_STEP;
  return { w: (base.c - 1) * step + ts + 40, h: (base.r - 1) * step + ts + 40 };
}

function sheepRender() {
  const s = sheepState;
  if (!s.lvl) return;
  const cfg = SHEEP_CFG[s.lvl];
  const board = document.getElementById('sheep-board');
  const slotBar = document.getElementById('sheep-slot-bar');
  const prog = document.getElementById('sheep-prog-fill');

  const isMobile = window.innerWidth < 480;
  const ts = isMobile ? 40 : SHEEP_TS;
  const step = isMobile ? 44 : SHEEP_STEP;

  const alive = s.tiles.filter(t => t.alive);
  const total = cfg.items * 6;
  const pct = Math.round(((total - alive.length) / total) * 100);
  document.getElementById('sheep-left').textContent = alive.length;
  document.getElementById('sheep-slots-free').textContent = cfg.slots - s.slots.length;

  // Update button states and darken if empty
  const undoBtn = document.getElementById('sheep-undo-btn');
  const shuffBtn = document.getElementById('sheep-shuffle-btn');

  document.getElementById('sheep-undo-rem').textContent = s.undoRem;
  document.getElementById('sheep-shuff-rem').textContent = s.shuffRem;

  undoBtn.disabled = s.undoRem <= 0;
  shuffBtn.disabled = s.shuffRem <= 0;

  if (s.undoRem <= 0) undoBtn.style.opacity = '0.3';
  else undoBtn.style.opacity = '1';

  if (s.shuffRem <= 0) shuffBtn.style.opacity = '0.3';
  else shuffBtn.style.opacity = '1';

  if (prog) prog.style.width = pct + '%';

  // Board tiles
  board.innerHTML = '';
  alive.slice().sort((a, b) => a.z - b.z).forEach(tile => {
    const blocked = sheepBlocked(tile, s.tiles);
    const img = RIGHT_IMAGES[tile.item];
    const el = document.createElement('div');
    el.className = `sheep-tile ${blocked ? 'blocked' : 'free'}`;
    const scaleRatio = isMobile ? (step / SHEEP_STEP) : 1;
    el.style.cssText = `
      left:${tile.x * scaleRatio}px;top:${tile.y * scaleRatio}px;width:${ts}px;height:${ts}px;
      background-image: url('${img}');
      background-color: ${blocked ? '#f0f0f5' : '#fff'};
      z-index:${tile.z * 10 + 1};
      box-shadow:${blocked ? 'none' : `inset 0 -4px 0 rgba(0,0,0,.15), 0 8px 18px rgba(0,0,0,.12)`};
      border:1px solid ${blocked ? 'rgba(0,0,0,.04)' : 'rgba(0,0,0,.08)'};
    `;
    if (!blocked) el.addEventListener('click', () => sheepClick(tile));
    board.appendChild(el);
  });

  // Slot bar
  slotBar.innerHTML = '';
  slotBar.className = `sheep-slot-bar${s.shaking ? ' shake' : ''}`;
  for (let i = 0; i < cfg.slots; i++) {
    const itemName = s.slots[i];
    const img = itemName ? RIGHT_IMAGES[itemName] : null;
    const flashing = s.matching && itemName === s.matching;
    const el = document.createElement('div');
    el.className = `sheep-slot${flashing ? ' flashing' : ''}${itemName && !flashing ? ' pop' : ''}`;
    if (itemName) {
      el.style.backgroundImage = `url('${img}')`;
      el.style.backgroundColor = '#fff';
      el.style.borderStyle = 'solid';
    }
    slotBar.appendChild(el);
  }

  // Legend
  const legend = document.getElementById('sheep-legend');
  legend.innerHTML = '';
  const itemCounts = {};
  s.tiles.forEach(t => { if (t.alive) itemCounts[t.item] = (itemCounts[t.item] || 0) + 1; });
  s.slots.forEach(l => { itemCounts[l] = (itemCounts[l] || 0) + 1; });

  const pool = s.tiles.reduce((acc, t) => acc.has(t.item) ? acc : acc.add(t.item), new Set());

  [...pool].forEach(item => {
    const count = itemCounts[item] || 0;
    const img = RIGHT_IMAGES[item];
    const chip = document.createElement('div');
    chip.className = `sheep-legend-chip${count === 0 ? ' done' : ''}`;
    chip.style.cssText = `background:white; border:1px solid rgba(0,0,0,.1); display:flex; align-items:center; gap:6px; padding:4px 10px;`;
    chip.innerHTML = `<img src="${img}" style="width:16px;height:16px;object-fit:contain;"> <span style="font-size:10px;">×${count}</span>`;
    legend.appendChild(chip);
  });
}

function sheepClick(tile) {
  const s = sheepState;
  if (!s.active || s.matching) return;
  const cfg = SHEEP_CFG[s.lvl];
  if (s.slots.length >= cfg.slots) {
    s.shaking = true; sheepRender();
    setTimeout(() => { s.shaking = false; sheepRender(); }, 500);
    return;
  }
  s.history.push({ tiles: s.tiles.map(t => ({ ...t })), slots: [...s.slots] });
  s.tiles = s.tiles.map(t => t.id === tile.id ? { ...t, alive: false } : t);
  s.slots = [...s.slots, tile.item];
  sheepRender();

  const counts = {};
  s.slots.forEach(l => { counts[l] = (counts[l] || 0) + 1; });
  const tripled = Object.keys(counts).find(l => counts[l] >= 3);

  if (tripled) {
    s.matching = tripled;
    sheepRender();
    setTimeout(() => {
      s.matching = null;
      let removed = 0;
      s.slots = s.slots.filter(l => { if (l === tripled && removed < 3) { removed++; return false; } return true; });
      const bLeft = s.tiles.filter(t => t.alive).length;
      sheepRender();
      if (bLeft === 0 && s.slots.length === 0) sheepEnd(true);
      else if (bLeft === 0 && s.slots.length > 0) {
        // If board empty but slots still have pieces, continue until slots full or cleared
      }
    }, 450);
  } else {
    const bLeft = s.tiles.filter(t => t.alive).length;
    if (s.slots.length >= cfg.slots) { setTimeout(() => sheepEnd(false), 260); }
    else if (bLeft === 0 && s.slots.length === 0) sheepEnd(true);
  }
}

function sheepEnd(won) {
  const s = sheepState;
  s.active = false;
  clearInterval(s.timer);
  const cfg = SHEEP_CFG[s.lvl];
  const timeStr = document.getElementById('sheep-time').textContent;

  saveGameRecord('Sheep Puzzle', s.lvl, won, timeStr);

  showGameResult(document.getElementById('sheep-result'), won,
    won ? 'Board Cleared!' : 'Game Over',
    won ? `🎉 All tiles cleared on ${cfg.label} in ${timeStr}!` : `😢 Try again! ${s.tiles.filter(t => t.alive).length} tiles remained.`,
    () => sheepInit(s.lvl),
    s.lvl,
    () => sheepInit(s.lvl + 1)
  );
}

function sheepInit(lvl) {
  const cfg = SHEEP_CFG[lvl];
  if (sheepState.timer) clearInterval(sheepState.timer);

  sheepState = {
    tiles: sheepMakeTiles(lvl), slots: [], history: [], matching: null, lvl,
    shaking: false, secs: cfg.time, undoRem: cfg.undo, shuffRem: cfg.shuffle, active: false
  };

  activeGameId = 'gv-sheep';
  isPaused = false;
  document.getElementById('gv-sheep').classList.remove('paused');
  document.getElementById('gv-sheep').classList.remove('started'); // Enforce start
  document.getElementById('sheep-result').style.display = 'none';
  const { w, h } = sheepBoardSize(lvl);
  const board = document.getElementById('sheep-board');
  board.style.width = w + 'px';
  board.style.height = h + 'px';

  document.getElementById('sheep-start-btn').innerHTML = '▶ Start';
  document.getElementById('sheep-start-btn').classList.remove('ghost');

  updateSheepTimer();
  sheepRender();
}

function sheepStart() {
  if (sheepState.active && !isPaused) {
    togglePause('gv-sheep');
    return;
  }

  if (isPaused) {
    togglePause('gv-sheep');
    return;
  }

  document.getElementById('gv-sheep').classList.add('started');
  sheepState.active = true;
  isPaused = false;
  activeGameId = 'gv-sheep';

  const startBtn = document.getElementById('sheep-start-btn');
  startBtn.innerHTML = '⏸ Pause';
  startBtn.classList.add('ghost');

  if (sheepState.timer) clearInterval(sheepState.timer);
  sheepState.timer = setInterval(() => {
    if (!sheepState.active || isPaused) return;
    sheepState.secs--;
    updateSheepTimer();
    if (sheepState.secs <= 0) sheepEnd(false);
  }, 1000);
}

function updateSheepTimer() {
  const m = Math.floor(sheepState.secs / 60);
  const s = sheepState.secs % 60;
  const el = document.getElementById('sheep-time');
  el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  el.parentElement.style.color = sheepState.secs < 30 ? '#e74c3c' : '';
}

setupLvlPills('sheep-lvl-pills', lvl => sheepInit(lvl));
document.getElementById('sheep-start-btn').addEventListener('click', sheepStart);

document.getElementById('sheep-undo-btn').addEventListener('click', () => {
  const s = sheepState;
  if (!s.active || !s.history.length || s.matching || s.undoRem <= 0) return;
  const prev = s.history.pop();
  s.tiles = prev.tiles; s.slots = prev.slots;
  s.undoRem--;
  if (s.undoRem <= 0) document.getElementById('sheep-undo-btn').disabled = true;
  sheepRender();
});

document.getElementById('sheep-shuffle-btn').addEventListener('click', () => {
  const s = sheepState;
  if (!s.active || s.matching || s.shuffRem <= 0) return;
  const alive = s.tiles.filter(t => t.alive);
  const items = arrShuffle(alive.map(t => t.item));
  let i = 0;
  s.tiles = s.tiles.map(t => t.alive ? { ...t, item: items[i++] } : t);
  s.shuffRem--;
  if (s.shuffRem <= 0) document.getElementById('sheep-shuffle-btn').disabled = true;
  sheepRender();
});

document.getElementById('sheep-new-btn').addEventListener('click', () => sheepInit(sheepState.lvl));


/* ══════════════════════════════════════════════════════════
   GAME 2: BADGE MATCH (Memory Card Game)
══════════════════════════════════════════════════════════ */
const BM_CFG = {
  1: { pairs: 8, cols: 4, time: 60, cards: 16 },
  2: { pairs: 10, cols: 5, time: 90, cards: 20 },
  3: { pairs: 15, cols: 6, time: 120, cards: 30 }
};

let bmState = {
  lvl: 1, flipped: [], matched: 0, pairs: 0, score: 0, flips: 0,
  timer: null, canFlip: true, secs: 0, badges: [], active: false, hintsUsed: 0
};

function bmBuildGrid(lvl) {
  const cfg = BM_CFG[lvl];
  const badges = getGameBadges(cfg.pairs);
  bmState = {
    lvl, flipped: [], matched: 0, pairs: cfg.pairs, score: 0, flips: 0,
    timer: null, canFlip: true, secs: cfg.time, badges, active: false, hintsUsed: 0
  };

  const cards = arrShuffle([...badges, ...badges]);
  const grid = document.getElementById('bm-grid');
  grid.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;
  grid.style.maxWidth = cfg.cols <= 4 ? '400px' : '600px';
  grid.innerHTML = cards.map((bid, i) =>
    `<div class="bm-card" data-idx="${i}" data-bid="${bid}">
      <div class="bm-inner">
        <div class="bm-front">
          <img src="image/Game/BADGE_MATCH.png" alt="Badge Match" style="width: 55%; height: 55%; object-fit: contain; opacity: 0.85;">
        </div>
        <div class="bm-back" style="background-image:url('${badgeImg(bid)}')"></div>
      </div>
    </div>`
  ).join('');

  grid.querySelectorAll('.bm-card').forEach(card => card.addEventListener('click', () => bmFlip(card)));

  document.getElementById('bm-hint-btn').innerHTML = `💡 Hint (3 Left)`;
  document.getElementById('bm-hint-btn').disabled = false;
  document.getElementById('bm-start-btn').innerHTML = '▶ Start';
  document.getElementById('bm-start-btn').classList.remove('ghost');

  bmUpdateStats();
  document.getElementById('bm-time').textContent = cfg.time + 's';
  resetLvlPills('badgematch-lvl-pills', lvl);
}

function bmStart() {
  if (bmState.active && !isPaused) {
    togglePause('gv-badgematch');
    return;
  }

  if (isPaused) {
    togglePause('gv-badgematch');
    return;
  }

  document.getElementById('gv-badgematch').classList.add('started');
  bmState.active = true;
  isPaused = false;
  activeGameId = 'gv-badgematch';

  const startBtn = document.getElementById('bm-start-btn');
  startBtn.innerHTML = '⏸ Pause';
  startBtn.classList.add('ghost');

  if (bmState.timer) clearInterval(bmState.timer);
  bmState.timer = setInterval(() => {
    if (!bmState.active || isPaused) return;
    bmState.secs--;
    document.getElementById('bm-time').textContent = bmState.secs + 's';
    if (bmState.secs <= 0) { clearInterval(bmState.timer); bmEnd(false); }
  }, 1000);
}

function bmFlip(card) {
  if (!bmState.canFlip || !bmState.active || isPaused) return; // FIX: check active/pause
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  bmState.flipped.push(card);
  bmState.flips++;
  bmUpdateStats();
  if (bmState.flipped.length === 2) {
    bmState.canFlip = false;
    const [a, b] = bmState.flipped;
    if (a.dataset.bid === b.dataset.bid) {
      setTimeout(() => {
        a.classList.add('matched'); b.classList.add('matched');
        bmState.matched++;
        const timeBonus = Math.max(0, Math.floor(bmState.secs / 10));
        bmState.score += 100 + timeBonus * 10;
        bmState.flipped = []; bmState.canFlip = true;
        bmUpdateStats();
        if (bmState.matched === bmState.pairs) { clearInterval(bmState.timer); bmEnd(true); }
      }, 400);
    } else {
      bmState.score = Math.max(0, bmState.score - 10);
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        bmState.flipped = []; bmState.canFlip = true;
        bmUpdateStats();
      }, 900);
    }
  }
}

function bmUpdateStats() {
  document.getElementById('bm-pairs').textContent = `${bmState.matched}/${bmState.pairs}`;
  document.getElementById('bm-score').textContent = bmState.score;
  document.getElementById('bm-flips').textContent = bmState.flips;
}

function bmEnd(won) {
  if (bmState.timer) clearInterval(bmState.timer);
  const s = bmState;
  saveGameRecord('Badge Match', s.lvl, won, `Score: ${s.score} · ${s.flips} flips`);
  showGameResult(document.getElementById('bm-result'), won,
    won ? 'All Pairs Found!' : 'Time Up!',
    won ? `Score: ${bmState.score} pts in ${bmState.flips} flips` : `Only ${bmState.matched}/${bmState.pairs} pairs found.`,
    () => bmInit(bmState.lvl),
    s.lvl,
    () => bmInit(s.lvl + 1)
  );
}

function bmInit(lvl) {
  if (bmState.timer) clearInterval(bmState.timer);
  const wrap = document.querySelector('.mem-wrap');
  if (wrap) wrap.className = `mem-wrap mem-lvl-${lvl}`;

  document.getElementById('bm-result').style.display = 'none';
  activeGameId = 'gv-badgematch';
  document.getElementById('gv-badgematch').classList.remove('paused');
  document.getElementById('gv-badgematch').classList.remove('started'); // Enforce start
  bmBuildGrid(lvl);
}

setupLvlPills('badgematch-lvl-pills', lvl => bmInit(lvl));
document.getElementById('bm-start-btn').addEventListener('click', () => bmStart());
document.getElementById('bm-hint-btn').addEventListener('click', () => {
  if (!bmState.canFlip || !bmState.active || isPaused) return;
  if (bmState.hintsUsed >= 3) return;

  const unmatched = [...document.querySelectorAll('.bm-card:not(.matched):not(.flipped)')];
  const groupedByBid = {};
  unmatched.forEach(c => { (groupedByBid[c.dataset.bid] = groupedByBid[c.dataset.bid] || []).push(c); });
  const pair = Object.values(groupedByBid).find(g => g.length >= 2);
  if (!pair) return;

  bmState.hintsUsed++;
  document.getElementById('bm-hint-btn').innerHTML = `💡 Hint (${3 - bmState.hintsUsed} Left)`;
  if (bmState.hintsUsed >= 3) document.getElementById('bm-hint-btn').disabled = true;

  pair[0].classList.add('hint-pulse');
  pair[1].classList.add('hint-pulse');
  bmState.score = Math.max(0, bmState.score - 10); // Standardized reduction
  bmUpdateStats();
  setTimeout(() => { pair[0].classList.remove('hint-pulse'); pair[1].classList.remove('hint-pulse'); }, 1500);
});



/* ══════════════════════════════════════════════════════════
   GAME 3: MEMORY DRIFT
══════════════════════════════════════════════════════════ */
const DRIFT_CFG = {
  1: { size: 3, memorySecs: 3.0, changes: 1 },
  2: { size: 4, memorySecs: 3.5, changes: 2 },
  3: { size: 5, memorySecs: 4.0, changes: 3 },
};

let driftState = {
  lvl: 1, round: 1, score: 0, phase: 'idle', grid: [],
  original: [], changedIdx: [], guessed: new Set(), timer: null, active: false
};

function driftBuildGrid(arr, lvl, interactive) {
  const cfg = DRIFT_CFG[lvl];
  const gridEl = document.getElementById('drift-grid');
  gridEl.style.gridTemplateColumns = `repeat(${cfg.size}, 1fr)`;
  gridEl.style.maxWidth = `${cfg.size * 72}px`;
  gridEl.style.margin = '0 auto'; // Centers the grid

  gridEl.innerHTML = arr.map((bid, i) =>
    `<div class="drift-cell" data-idx="${i}" style="background-image:url('${badgeImg(bid)}'); background-size: 80%; background-position: center; background-repeat: no-repeat;"></div>`
  ).join('');

  if (interactive) {
    gridEl.querySelectorAll('.drift-cell').forEach(cell => {
      cell.addEventListener('click', () => driftGuess(parseInt(cell.dataset.idx)));
    });
  }
}

function driftGuess(idx) {
  if (driftState.phase !== 'guess' || !driftState.active || isPaused) return;
  if (driftState.guessed.has(idx)) return;

  const cfg = DRIFT_CFG[driftState.lvl];
  if (driftState.guessed.size >= cfg.changes) return; // Limit guesses

  driftState.guessed.add(idx);
  const cell = document.querySelector(`#drift-grid [data-idx="${idx}"]`);
  const isChanged = driftState.changedIdx.includes(idx);
  if (isChanged) {
    cell.classList.add('guessed-right');
    driftState.score += 10;
  } else {
    cell.classList.add('guessed-wrong');
    driftState.score = Math.max(0, driftState.score - 5);
  }
  document.getElementById('drift-score').textContent = driftState.score;

  const left = cfg.changes - driftState.guessed.size;
  document.getElementById('drift-phase-label').innerHTML = `Find what changed! | Changed: ${cfg.changes} | Clicks Left: ${left} | Time: <span style="color:#e74c3c">${Math.ceil(guessSecs)}s</span>`;

  if (driftState.guessed.size === cfg.changes || driftState.changedIdx.every(i => driftState.guessed.has(i))) {
    if (driftState.timer) clearInterval(driftState.timer);

    // Briefly show final state then auto-reveal
    setTimeout(() => {
      document.getElementById('drift-phase-label').textContent = 'Revealing all changes...';
      driftState.changedIdx.forEach(cid => {
        const c = document.querySelector(`#drift-grid [data-idx="${cid}"]`);
        if (c && !c.classList.contains('guessed-right')) {
          c.classList.add('guessed-right');
          c.style.animation = 'chainGlow 0.5s infinite';
        }
      });
      setTimeout(() => driftNextRound(), 2000);
    }, 600);
  }
}

function driftNextRound() {
  if (driftState.timer) clearInterval(driftState.timer);
  driftState.round++;
  if (driftState.round > 5) {
    document.getElementById('drift-phase-label').textContent = 'Session complete!';
    saveGameRecord('Memory Drift', driftState.lvl, driftState.score >= 30, `Score: ${driftState.score} pts`);
    activeGameId = null;
    showGameResult(document.getElementById('drift-result'), driftState.score >= 30,
      'Session Done!', `Final Score: ${driftState.score} pts`,
      () => driftInit(driftState.lvl),
      driftState.lvl,
      () => driftInit(driftState.lvl + 1));
    return;
  }
  driftState.guessed = new Set();
  driftState.phase = 'idle';
  document.getElementById('drift-round').textContent = `${driftState.round}/5`;
  document.getElementById('drift-phase-label').textContent = 'Ready for next round?';

  const startBtn = document.getElementById('drift-start-btn');
  startBtn.innerHTML = '▶ Next Round';
  startBtn.classList.remove('ghost');
  startBtn.style.display = 'inline-block';
}

function driftStart() {
  if (driftState.active && !isPaused && (driftState.phase === 'memorize' || driftState.phase === 'guess')) {
    togglePause('gv-drift');
    document.getElementById('drift-start-btn').innerHTML = '▶ Resume';
    return;
  }

  if (isPaused) {
    togglePause('gv-drift');
    document.getElementById('drift-start-btn').innerHTML = '⏸ Pause';
    return;
  }

  driftState.active = true;
  // If we are in 'idle' phase, actually start the round logic
  if (driftState.phase === 'idle') {
    driftStartRound();
  } else {
    togglePause('gv-drift');
  }
}

function driftStartRound() {
  document.getElementById('gv-drift').classList.add('started');
  const cfg = DRIFT_CFG[driftState.lvl];
  const n = cfg.size * cfg.size;
  const symbols = getGameBadges(n);
  driftState.original = [...symbols];
  driftState.phase = 'memorize';

  activeGameId = 'gv-drift';
  isPaused = false;
  document.getElementById('gv-drift').classList.remove('paused');

  // Ensure the button says "Pause"
  const startBtn = document.getElementById('drift-start-btn');
  startBtn.innerHTML = '⏸ Pause';
  startBtn.classList.add('ghost');

  document.getElementById('drift-phase-label').textContent = `Memorize! ${cfg.memorySecs}s`;
  driftBuildGrid(symbols, driftState.lvl, false);

  let memSecs = cfg.memorySecs;
  if (driftState.timer) clearInterval(driftState.timer);
  driftState.timer = setInterval(() => {
    if (isPaused) return;
    memSecs -= 0.1;
    if (memSecs <= 0) {
      clearInterval(driftState.timer);
      const idxPool = arrShuffle([...Array(n).keys()]);
      const changedIdx = idxPool.slice(0, cfg.changes);
      driftState.changedIdx = changedIdx;
      const newGrid = [...driftState.original];
      const unusedBadges = BADGE_POOL.filter(b => !newGrid.includes(b));
      changedIdx.forEach(i => {
        newGrid[i] = unusedBadges[Math.floor(Math.random() * unusedBadges.length)];
      });
      driftState.grid = newGrid;
      driftState.phase = 'guess';

      // Start 10-second Guess Phase
      let guessSecs = 10;
      const initialLeft = cfg.changes;
      document.getElementById('drift-phase-label').innerHTML = `Find what changed! | Changed: ${cfg.changes} | Clicks Left: ${initialLeft} | Time: <span style="color:#e74c3c">${guessSecs}s</span>`;
      driftBuildGrid(newGrid, driftState.lvl, true);

      driftState.timer = setInterval(() => {
        if (isPaused) return;
        guessSecs--;
        if (guessSecs <= 0) {
          clearInterval(driftState.timer);
          // Reveal correctly and move to next
          document.getElementById('drift-phase-label').textContent = 'Time Up! Showing changes...';
          driftState.changedIdx.forEach(idx => {
            const cell = document.querySelector(`#drift-grid [data-idx="${idx}"]`);
            if (cell && !cell.classList.contains('guessed-right')) {
              cell.classList.add('guessed-right');
              cell.style.animation = 'chainGlow 0.5s infinite';
            }
          });
          setTimeout(() => driftNextRound(), 2500);
        } else {
          document.getElementById('drift-phase-label').innerHTML = `Find what changed! <span style="color:#e74c3c">Time: ${guessSecs}s</span>`;
        }
      }, 1000);
    } else {
      document.getElementById('drift-phase-label').textContent = `Memorize! ${memSecs.toFixed(1)}s`;
    }
  }, 100);
}

function driftInit(lvl) {
  if (driftState.timer) clearInterval(driftState.timer);
  driftState = { lvl, round: 1, score: 0, phase: 'idle', grid: [], original: [], changedIdx: [], guessed: new Set(), timer: null, active: false };

  activeGameId = 'gv-drift';
  document.getElementById('gv-drift').classList.remove('paused');
  document.getElementById('gv-drift').classList.remove('started'); // Enforce start

  document.getElementById('drift-result').style.display = 'none';
  document.getElementById('drift-round').textContent = '1/5';
  document.getElementById('drift-score').textContent = '0';
  document.getElementById('drift-phase-label').textContent = 'Ready?';

  const gridEl = document.getElementById('drift-grid');
  if (gridEl) gridEl.innerHTML = '';

  document.getElementById('drift-start-btn').innerHTML = '▶ Start';
  document.getElementById('drift-start-btn').classList.remove('ghost');
  document.getElementById('drift-start-btn').style.display = 'inline-block';
  resetLvlPills('drift-lvl-pills', lvl);
}

setupLvlPills('drift-lvl-pills', lvl => driftInit(lvl));
document.getElementById('drift-start-btn').addEventListener('click', driftStart);

/* ══════════════════════════════════════════════════════════
   GAME 5: SCOUT'S SASH (Drag Chain)
══════════════════════════════════════════════════════════ */
const SASH_CFG = {
  1: { target: 500, time: 90 },
  2: { target: 1000, time: 80 },
  3: { target: 2000, time: 70 }
};
const SASH_ROWS = 7, SASH_COLS = 7;
const SASH_BADGE_COUNT = 8;

let sashState = {
  lvl: 1, board: [], chain: [], dragging: false, score: 0,
  time: 90, timer: null, running: false, badges: [], active: false
};
let sashHintTimer = null;

function sashInit(lvl) {
  if (sashState.timer) clearInterval(sashState.timer);
  clearTimeout(sashHintTimer);
  const badges = getGameBadges(SASH_BADGE_COUNT);
  const n = SASH_ROWS * SASH_COLS;

  sashState = {
    lvl, board: [], chain: [], dragging: false, score: 0, time: SASH_CFG[lvl].time, timer: null,
    running: false, badges, active: false
  };

  // Generate board and ensure at least one match-3 exists
  let attempts = 0;
  while (attempts < 50) {
    sashState.board = Array.from({ length: n }, () => Math.floor(Math.random() * SASH_BADGE_COUNT));
    if (sashCheckForMatches()) break;
    attempts++;
  }

  activeGameId = 'gv-sash';
  document.getElementById('gv-sash').classList.remove('paused');
  document.getElementById('gv-sash').classList.remove('started'); // Enforce start

  document.getElementById('sash-result').style.display = 'none';
  document.getElementById('sash-score').textContent = '0';
  document.getElementById('sash-target').textContent = SASH_CFG[lvl].target;
  document.getElementById('sash-time').textContent = SASH_CFG[lvl].time + 's';

  document.getElementById('sash-start-btn').innerHTML = '▶ Start';
  document.getElementById('sash-start-btn').classList.remove('ghost');
  document.getElementById('sash-start-btn').style.display = 'inline-block';
  resetLvlPills('sash-lvl-pills', lvl);
  sashRender();
}

function sashCheckForMatches() {
  const n = SASH_ROWS * SASH_COLS, b = sashState.board;
  for (let i = 0; i < n; i++) {
    const val = b[i], r = Math.floor(i / SASH_COLS), c = i % SASH_COLS;
    let matchingNeighbors = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < SASH_ROWS && nc >= 0 && nc < SASH_COLS && b[nr * SASH_COLS + nc] === val) {
        matchingNeighbors++;
      }
    }
    if (matchingNeighbors >= 2) return true; // Chain of 3 possible
  }
  return false;
}

function sashRender() {
  const board = document.getElementById('sash-board');
  board.style.gridTemplateColumns = `repeat(${SASH_COLS}, 1fr)`;
  board.innerHTML = sashState.board.map((bIdx, i) => {
    const img = badgeImg(sashState.badges[bIdx]);
    const inChain = sashState.chain.includes(i);
    return `<div class="sash-cell${inChain ? ' chained' : ''}" data-idx="${i}" style="background-image:url('${img}');border-color:${inChain ? '#FFD166' : 'transparent'}"></div>`;
  }).join('');
  board.querySelectorAll('.sash-cell').forEach(el => {
    const idx = parseInt(el.dataset.idx);
    el.addEventListener('pointerdown', e => { e.preventDefault(); sashStartChain(idx); });
    el.addEventListener('pointerenter', () => sashExtendChain(idx));
  });
  board.addEventListener('pointerup', sashEndChain, { once: true });
}

function sashAdjacent(a, b) {
  const ar = Math.floor(a / SASH_COLS), ac = a % SASH_COLS;
  const br = Math.floor(b / SASH_COLS), bc = b % SASH_COLS;
  return Math.abs(ar - br) <= 1 && Math.abs(ac - bc) <= 1 && a !== b;
}

function sashStartChain(idx) {
  if (!sashState.running) return;
  clearTimeout(sashHintTimer);
  sashState.dragging = true; sashState.chain = [idx]; sashRender();
}

function sashExtendChain(idx) {
  if (!sashState.dragging) return;
  const chain = sashState.chain; if (!chain.length) return;
  if (sashState.board[idx] !== sashState.board[chain[0]]) return;
  if (chain.includes(idx)) return;
  if (!sashAdjacent(idx, chain[chain.length - 1])) return;
  sashState.chain.push(idx); sashRender();
}

function sashEndChain() {
  sashState.dragging = false;
  const n = sashState.chain.length;
  if (n >= 2) { // Changed to 2 as per user request if necessary, or keep 3 for balance
    const pts = n * 10; // Standardized: 10 points per cell
    sashState.score += pts;
    document.getElementById('sash-score').textContent = sashState.score;
    sashState.chain.forEach(i => { sashState.board[i] = Math.floor(Math.random() * SASH_BADGE_COUNT); });
    if (sashState.score >= SASH_CFG[sashState.lvl].target) sashEnd(true);
  }
  sashState.chain = []; sashRender();
  if (sashState.running && !isPaused) sashScheduleHint();
}

function sashScheduleHint() {
  clearTimeout(sashHintTimer);
  if (!sashState.running) return;
  sashHintTimer = setTimeout(() => {
    if (isPaused) { sashScheduleHint(); return; }
    const b = sashState.board;
    for (let i = 0; i < b.length; i++) {
      const r = Math.floor(i / SASH_COLS), c = i % SASH_COLS;
      const neighbors = [];
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SASH_ROWS && nc >= 0 && nc < SASH_COLS && b[nr * SASH_COLS + nc] === b[i]) neighbors.push(nr * SASH_COLS + nc);
      }
      if (neighbors.length >= 2) {
        const els = document.querySelectorAll('.sash-cell');
        [i, ...neighbors.slice(0, 2)].forEach(j => els[j]?.classList.add('sash-hint'));
        setTimeout(() => document.querySelectorAll('.sash-hint').forEach(e => e.classList.remove('sash-hint')), 1500);
        // Repeat hint until interaction
        sashScheduleHint();
        return;
      }
    }
    sashScheduleHint(); // Try again if no hint found
  }, 4000);
}

function sashEnd(won) {
  if (sashState.timer) clearInterval(sashState.timer);
  clearTimeout(sashHintTimer);
  sashState.running = false;
  saveGameRecord('Link the Badge', sashState.lvl, won, `Score: ${sashState.score} pts`);
  showGameResult(document.getElementById('sash-result'), won,
    won ? 'Target Reached!' : 'Time Up!',
    `Score: ${sashState.score} / ${SASH_CFG[sashState.lvl].target} pts`,
    () => sashInit(sashState.lvl),
    sashState.lvl,
    () => sashInit(sashState.lvl + 1)
  );
}

function sashStart() {
  if (sashState.running && !isPaused) {
    togglePause('gv-sash');
    return;
  }
  document.getElementById('gv-sash').classList.add('started');

  if (isPaused) {
    togglePause('gv-sash');
    return;
  }

  sashState.running = true;
  isPaused = false;
  activeGameId = 'gv-sash';

  const startBtn = document.getElementById('sash-start-btn');
  startBtn.innerHTML = '⏸ Pause';
  startBtn.classList.add('ghost');

  if (sashState.timer) clearInterval(sashState.timer);
  sashState.timer = setInterval(() => {
    if (!sashState.running || isPaused) return;
    sashState.time--;
    document.getElementById('sash-time').textContent = sashState.time + 's';
    if (sashState.time <= 0) sashEnd(false);
  }, 1000);
  sashScheduleHint();
}

setupLvlPills('sash-lvl-pills', lvl => sashInit(lvl));
document.getElementById('sash-start-btn').addEventListener('click', sashStart);



/* ══════════════════════════════════════════════════════════
   GAME 8: SEQUENCE MEMORY
══════════════════════════════════════════════════════════ */
const SEQ_CFG = {
  1: { len: 3, memSecs: 5.0, ansSecs: 12, palette: 5 },
  2: { len: 6, memSecs: 6.0, ansSecs: 10, palette: 7 },
  3: { len: 8, memSecs: 7.0, ansSecs: 8, palette: 9 },
};

let seqState = {
  lvl: 1, round: 1, score: 0, sequence: [], answer: [],
  hintsLeft: 3, phase: 'idle', ansTimer: null, badges: [], active: false
};

function seqInit(lvl) {
  if (seqState.ansTimer) clearInterval(seqState.ansTimer);
  if (seqState.timer) clearInterval(seqState.timer);
  seqState = {
    lvl, round: 1, score: 0, sequence: [], answer: [],
    hintsLeft: 3, phase: 'idle', ansTimer: null, timer: null, badges: [], active: false
  };

  activeGameId = 'gv-seqmem';
  isPaused = false;
  const gv = document.getElementById('gv-seqmem');
  gv.classList.remove('paused');
  // Use classList to preserve 'active' and other classes
  gv.classList.remove('seq-lvl-1', 'seq-lvl-2', 'seq-lvl-3');
  gv.classList.add('seq-lvl-' + lvl);

  document.getElementById('seq-result').style.display = 'none';
  document.getElementById('seq-round').textContent = '1/5';
  document.getElementById('seq-score').textContent = '0';
  document.getElementById('seq-hint-btn').textContent = '💡 Hint (3 left)';
  document.getElementById('seq-hint-btn').disabled = false;
  document.getElementById('seq-phase').textContent = 'Ready?';

  document.getElementById('seq-display').innerHTML = '';
  document.getElementById('seq-answer').innerHTML = '';
  document.getElementById('seq-palette').innerHTML = '';

  document.getElementById('seqmem-start-btn').innerHTML = '▶ Start';
  document.getElementById('seqmem-start-btn').classList.remove('ghost');
  document.getElementById('seqmem-start-btn').style.display = 'inline-block';
  resetLvlPills('seqmem-lvl-pills', lvl);
}

function seqStart() {
  if (seqState.active && !isPaused) {
    togglePause('gv-seqmem');
    return;
  }

  if (isPaused) {
    togglePause('gv-seqmem');
    return;
  }

  seqState.active = true;
  isPaused = false;
  activeGameId = 'gv-seqmem';
  document.getElementById('gv-seqmem').classList.add('started');

  const startBtn = document.getElementById('seqmem-start-btn');
  startBtn.innerHTML = '⏸ Pause';
  startBtn.classList.add('ghost');

  if (seqState.phase === 'idle' || seqState.phase === 'check') {
    document.getElementById('gv-seqmem').classList.add('started');
    seqStartRound();
  }
}

function seqStartRound() {
  if (seqState.ansTimer) clearInterval(seqState.ansTimer);
  if (seqState.timer) clearInterval(seqState.timer);

  const cfg = SEQ_CFG[seqState.lvl];
  const badges = getGameBadges(cfg.palette);
  seqState.badges = badges;
  seqState.sequence = Array.from({ length: cfg.len }, () => badges[Math.floor(Math.random() * badges.length)]);
  seqState.answer = [];
  seqState.phase = 'memorize';

  document.getElementById('seq-display').innerHTML = seqState.sequence.map(bid =>
    `<div class="seq-item" style="background-image:url('${badgeImg(bid)}')"></div>`).join('');
  document.getElementById('seq-answer').innerHTML = Array(cfg.len).fill('<div class="seq-answer-slot"></div>').join('');
  document.getElementById('seq-palette').innerHTML = '';
  document.getElementById('seq-hint-btn').disabled = true; // FREEZE HINT

  let memRemaining = cfg.memSecs;
  document.getElementById('seq-phase').textContent = `Memorize! ${memRemaining}s`;

  seqState.timer = setInterval(() => {
    if (isPaused) return;
    memRemaining--;
    if (memRemaining <= 0) {
      clearInterval(seqState.timer);
      document.getElementById('seq-display').innerHTML = seqState.sequence.map(() =>
        `<div class="seq-item ghost"></div>`).join('');
      seqState.phase = 'answer';
      document.getElementById('seq-phase').textContent = 'Recreate!';
      document.getElementById('seq-hint-btn').disabled = false; // ENABLE HINT
      if (seqState.hintsLeft <= 0) document.getElementById('seq-hint-btn').disabled = true;
      document.getElementById('seq-palette').innerHTML = badges.map(bid =>
        `<div class="seq-pal-item" data-bid="${bid}" style="background-image:url('${badgeImg(bid)}')"></div>`).join('');
      document.querySelectorAll('.seq-pal-item').forEach(el => el.addEventListener('click', () => seqPick(el.dataset.bid)));
      seqStartAnswerTimer(cfg.ansSecs);
    } else {
      document.getElementById('seq-phase').textContent = `Memorize! ${memRemaining}s`;
    }
  }, 1000);
}

function seqStartAnswerTimer(secs) {
  let remaining = secs;
  const phasEl = document.getElementById('seq-phase');
  phasEl.textContent = `Recreate! ${remaining}s`;
  seqState.ansTimer = setInterval(() => {
    if (isPaused) return;
    remaining--;
    phasEl.textContent = `Recreate! ${remaining}s`;
    if (remaining <= 0) {
      clearInterval(seqState.ansTimer);
      seqState.phase = 'check';
      seqCheckAnswer();
    }
  }, 1000);
}

function seqPick(bid) {
  if (seqState.phase !== 'answer' || isPaused) return;
  const cfg = SEQ_CFG[seqState.lvl];
  seqState.answer.push(bid);
  const idx = seqState.answer.length - 1;
  const slots = document.querySelectorAll('#seq-answer .seq-answer-slot');
  if (slots[idx]) {
    slots[idx].style.backgroundImage = `url('${badgeImg(bid)}')`;
    slots[idx].classList.add('filled');
  }
  if (seqState.answer.length === cfg.len) {
    clearInterval(seqState.ansTimer);
    seqState.phase = 'check';
    setTimeout(seqCheckAnswer, 400);
  }
}

function seqCheckAnswer() {
  if (seqState.ansTimer) clearInterval(seqState.ansTimer);
  if (seqState.timer) clearInterval(seqState.timer);

  const total = seqState.sequence.length;
  const correctCount = seqState.answer.filter((b, i) => b === seqState.sequence[i]).length;
  const allCorrect = correctCount === total;

  const pts = allCorrect ? 100 : Math.round((correctCount / total) * 50);
  seqState.score += pts;
  document.getElementById('seq-score').textContent = seqState.score;

  const phasEl = document.getElementById('seq-phase');
  phasEl.innerHTML = `<span style="color:${allCorrect ? '#27ae60' : '#e67e22'}">${correctCount}/${total} Correct! +${pts} pts</span><br><small style="font-size:10px;opacity:0.6">Original Sequence Below</small>`;

  // Reveal the hidden sequence with animations
  const displayItems = document.querySelectorAll('#seq-display .seq-item');
  const answerSlots = document.querySelectorAll('#seq-answer .seq-answer-slot');

  seqState.sequence.forEach((bid, i) => {
    if (displayItems[i]) {
      displayItems[i].classList.remove('ghost');
      displayItems[i].style.backgroundImage = `url('${badgeImg(bid)}')`;
    }
    if (answerSlots[i]) {
      if (seqState.answer[i] !== bid) {
        answerSlots[i].classList.add('wrong');
        // Add a small correct badge marker
        const correctMarker = document.createElement('div');
        correctMarker.className = 'seq-item-correct-label';
        correctMarker.style.backgroundImage = `url('${badgeImg(bid)}')`;
        correctMarker.style.backgroundSize = 'contain';
        answerSlots[i].appendChild(correctMarker);
      } else {
        answerSlots[i].classList.add('correct-glow');
      }
    }
  });

  setTimeout(() => {
    if (activeGameId !== 'gv-seqmem') return; // User might have exited
    seqState.round++;
    if (seqState.round > 5) {
      saveGameRecord('Sequence Memory', seqState.lvl, seqState.score >= 250, `Score: ${seqState.score} pts`);
      showGameResult(document.getElementById('seq-result'), seqState.score >= 250,
        'Session Complete!', `Final Score: ${seqState.score} pts`,
        () => seqInit(seqState.lvl),
        seqState.lvl,
        () => seqInit(seqState.lvl + 1));
      return;
    }

    document.getElementById('seq-round').textContent = `${seqState.round}/5`;
    seqStartRound();
  }, 3500); // Give more time to compare
}
function parsePzSize(val) {
  const [w, h] = val.split('x').map(Number);
  return { cols: w, rows: h };
}

setupLvlPills('seqmem-lvl-pills', lvl => seqInit(lvl));
document.getElementById('seqmem-start-btn').addEventListener('click', () => seqStart());
document.getElementById('seq-hint-btn').addEventListener('click', () => {
  if (seqState.phase !== 'answer' || seqState.hintsLeft <= 0) return;
  const idx = seqState.answer.length;
  if (idx >= seqState.sequence.length) return;
  seqPick(seqState.sequence[idx]);
  seqState.hintsLeft--;
  document.getElementById('seq-hint-btn').textContent = `💡 Hint (${seqState.hintsLeft} left)`;
  if (seqState.hintsLeft <= 0) document.getElementById('seq-hint-btn').disabled = true;
});



/* ══════════════════════════════════════════════════════════
   GAME 9: SLIDING PUZZLE (Badge Image Slicer)
══════════════════════════════════════════════════════════ */
let pz = {
  cols: 3, rows: 3, tiles: [], empty: 8, moves: 0, secs: 0,
  timer: null, won: false, imgUrl: '', active: false
};

function initPuzzle() {
  if (pz.timer) clearInterval(pz.timer);
  document.getElementById('gv-puzzle').classList.remove('started');
  const activePill = document.querySelector('#puzzle-lvl-pills .lvl-pill.active');
  const size = activePill ? parseInt(activePill.dataset.lvl) : 3;
  const cols = size, rows = size;
  const n = cols * rows;
  const tiles = Array.from({ length: n }, (_, i) => i);
  let empty = n - 1;
  for (let i = 0; i < 400; i++) {
    const m = [];
    if (empty % cols !== 0) m.push(-1);
    if (empty % cols !== cols - 1) m.push(1);
    if (empty >= cols) m.push(-cols);
    if (empty < n - cols) m.push(cols);
    const d = m[Math.floor(Math.random() * m.length)];
    const ni = empty + d;
    [tiles[empty], tiles[ni]] = [tiles[ni], tiles[empty]];
    empty = ni;
  }
  if (pz.timer) clearInterval(pz.timer);
  const badgeId = BADGE_POOL[Math.floor(Math.random() * BADGE_POOL.length)];
  const imgUrl = badgeImg(badgeId);

  pz = { cols, rows, tiles, empty, moves: 0, secs: 0, timer: null, won: false, imgUrl, active: false };

  const ref = document.getElementById('pz-reference');
  if (ref) {
    ref.style.backgroundImage = `url('${imgUrl}')`;
    ref.innerHTML = ''; // Clear "Reference" text
  }

  document.getElementById('pz-moves').textContent = '0';
  document.getElementById('pz-time').textContent = '0:00';
  document.getElementById('pz-win').classList.remove('show');
  document.getElementById('puzzle-start-btn').innerHTML = '▶ Start';
  document.getElementById('puzzle-start-btn').classList.remove('ghost');

  renderPuzzleBoard();
}

function pzStart() {
  if (pz.active && !isPaused) {
    togglePause('gv-puzzle');
    return;
  }
  document.getElementById('gv-puzzle').classList.add('started');

  if (isPaused) {
    togglePause('gv-puzzle');
    return;
  }

  pz.active = true;
  isPaused = false;
  activeGameId = 'gv-puzzle';

  const startBtn = document.getElementById('puzzle-start-btn');
  startBtn.innerHTML = '⏸ Pause';
  startBtn.classList.add('ghost');

  if (pz.timer) clearInterval(pz.timer);
  pz.timer = setInterval(() => {
    if (pz.won || isPaused) return;
    pz.secs++;
    document.getElementById('pz-time').textContent =
      `${Math.floor(pz.secs / 60)}:${(pz.secs % 60).toString().padStart(2, '0')}`;
  }, 1000);
}

function renderPuzzleBoard() {
  const { cols, rows, tiles, empty, won, imgUrl } = pz;
  const grid = document.getElementById('puzzle-grid');
  if (!grid) return;

  const maxW = window.innerWidth < 480 ? 280 : 400;
  const boardW = Math.min(window.innerWidth - 60, maxW);
  const tileSize = Math.floor(boardW / cols);
  const totalW = tileSize * cols;
  const totalH = tileSize * rows;

  grid.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
  grid.style.width = `${totalW}px`; // Exact width
  grid.style.height = `${totalH}px`;
  grid.style.margin = '0 auto';

  grid.innerHTML = tiles.map((val, i) => {
    if (i === empty) return `<div class="tile empty" style="width:${tileSize}px;height:${tileSize}px"></div>`;
    const srcCol = val % cols;
    const srcRow = Math.floor(val / cols);
    const bgX = -(srcCol * tileSize);
    const bgY = -(srcRow * tileSize);
    return `<div class="tile${won ? ' solved' : ''}" data-idx="${i}"
      style="width:${tileSize}px;height:${tileSize}px;
      background-image:url('${imgUrl}');
      background-size:${totalW}px ${totalH}px;
      background-position:${bgX}px ${bgY}px;
      background-repeat:no-repeat;
      display: inline-block; vertical-align: top;"></div>`;
  }).join('');

  if (!won) grid.querySelectorAll('.tile:not(.empty)').forEach(el =>
    el.addEventListener('click', () => moveTile(+el.dataset.idx)));
}

function moveTile(idx) {
  if (pz.won || isPaused || !pz.active) return; // FIX: Only move if active
  const { cols, empty, tiles } = pz;
  const di = Math.abs(idx - empty);
  const sameRow = Math.floor(idx / cols) === Math.floor(empty / cols);
  if ((di === 1 && sameRow) || di === cols) {
    [tiles[idx], tiles[empty]] = [tiles[empty], tiles[idx]];
    pz.empty = idx; pz.moves++;
    document.getElementById('pz-moves').textContent = pz.moves;
    renderPuzzleBoard();
    if (tiles.every((val, i) => val === i)) {
      pz.won = true; if (pz.timer) clearInterval(pz.timer);
      const timeStr = document.getElementById('pz-time').textContent;
      saveGameRecord('Sliding Puzzle', `${pz.cols}x${pz.rows}`, true, `${pz.moves} moves · ${timeStr}`);

      const res = document.getElementById('pz-win');
      res.innerHTML = `<div class="pz-win-title">🎉 Puzzle Solved!</div>
                      <div class="pz-win-sub">Solved in ${pz.moves} moves · ${timeStr}</div>`;
      res.classList.add('show');

      showGameResult(document.getElementById('bm-result'), true,
        'Puzzle Solved!', `Moves: ${pz.moves} · Time: ${timeStr} · Lvl: ${pz.cols}x${pz.rows}`,
        () => initPuzzle(),
        pz.cols === 3 ? 1 : (pz.cols === 4 ? 2 : 3),
        () => {
          const next = pz.cols === 3 ? '4x4' : (pz.cols === 4 ? '5x5' : '5x5');
          document.getElementById('pz-size').value = next;
          initPuzzle();
        }
      );
      renderPuzzleBoard();
    }
  }
}

document.getElementById('pz-new').addEventListener('click', () => initPuzzle());
document.getElementById('puzzle-start-btn').addEventListener('click', pzStart);






(function nametag() {
  const nameEl = document.getElementById('nametag-name');
  const companyEl = document.getElementById('nametag-company');
  const listEl = document.getElementById('autocomplete-list');
  const box = document.getElementById('nametag');

  /* Auto-uppercase on blur */
  [nameEl, companyEl].forEach(el => {
    if (el) el.addEventListener('blur', function () {
      this.innerText = this.innerText.toUpperCase().trim();
    });
  });

  /* Name character limit (Strict 25 character enforcement) */
  if (nameEl) nameEl.addEventListener('input', function () {
    if (this.innerText.length > 25) {
      this.innerText = this.innerText.slice(0, 25);
      // Move cursor to the end
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(this.childNodes[0], 25);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  /* Nametag color toggle: white ↔ blue */
  if (box) box.addEventListener('click', function (e) {
    if (e.target.closest('[contenteditable]')) return;
    const isWhite = !this.classList.contains('nametag-blue');
    this.classList.toggle('nametag-blue', isWhite);
  });

  const suggestionsMap = {
    "1": ["1st KUALA LUMPUR COMPANY", "1st JOHOR BAHRU COMPANY", "1st MELAKA COMPANY", "1st SEREMBAN COMPANY", "1st PENANG COMPANY", "1st BINTULU COMPANY", "1st KUCHING COMPANY", "1st PENGKALAN KEMPAS COMPANY", "1st MUAR COMPANY", "1st SIMPANG RENGAM COMPANY", "1st TRIANG COMPANY", "1st IPOH COMPANY", "1st SANDAKAN COMPANY", "1st PENAMPANG COMPANY", "1st SARIKEI COMPANY", "1st PITAS COMPANY", "1st TAWAU COMPANY", "1st MIRI COMPANY", "1st BINTANGOR COMPANY"],
    "2": ["2nd KUALA LUMPUR COMPANY", "2nd SIBU COMPANY", "2nd MELAKA COMPANY", "2nd MANJUNG COMPANY", "2nd SEREMBAN COMPANY", "2nd KLUANG COMPANY", "2nd PENANG COMPANY", "2nd SANDAKAN COMPANY", "2nd BINTULU COMPANY", "2nd PITAS COMPANY", "2nd TAWAU COMPANY", "2nd K. KINABALU COMPANY"],
    "3": ["3rd KUALA LUMPUR COMPANY", "3rd MELAKA COMPANY", "3rd MANJUNG COMPANY", "3rd K. KINABALU COMPANY", "3rd BINTANGOR COMPANY", "3rd KUCHING COMPANY", "3rd SARIKEI COMPANY", "3rd SIBU COMPANY", "3rd TAWAU COMPANY", "3rd PITAS COMPANY", "3rd BUTTERWORTH COMPANY"],
    "4": ["4th KUALA LUMPUR COMPANY", "4th JOHOR BAHRU COMPANY", "4th MELAKA COMPANY", "4th KAMPAR COMPANY", "4th KUCHING COMPANY", "4th PETALING JAYA COMPANY", "4th BINTULU COMPANY", "4th K. KINABALU COMPANY", "4th SUNGAI PETANI COMPANY", "4th MIRI COMPANY", "4th JOHOR BAHRU COMPANY"],
    "5": ["5th KUALA LUMPUR COMPANY", "5th JOHOR BAHRU COMPANY", "5th PETALING JAYA COMPANY", "5th SANDAKAN COMPANY", "5th MIRI COMPANY", "5th KAJANG COMPANY", "5th JOHOR BAHRU COMPANY"],
    "6": ["6th KUALA LUMPUR COMPANY", "6th KUCHING COMPANY", "6th MIRI COMPANY", "6th KAJANG COMPANY", "6th Ipoh COMPANY"],
    "7": ["7th KUALA LUMPUR COMPANY", "7th KUCHING COMPANY", "7th MIRI COMPANY", "7th PETALING JAYA COMPANY", "7th Ipoh COMPANY", "7th SIBU COMPANY"],
    "8": ["8th KUALA LUMPUR COMPANY", "8th KUCHING COMPANY", "8th PETALING JAYA COMPANY", "8th Ipoh COMPANY", "8th PENANG COMPANY", "8th SIBU COMPANY"],
    "9": ["9th KUALA LUMPUR COMPANY", "9th PETALING JAYA COMPANY", "9th SIBU COMPANY", "9th KUCHING COMPANY"],
    "10": ["10th KUALA LUMPUR COMPANY", "10th SIBU COMPANY", "10th KUCHING COMPANY"],
    "11": ["11th KUALA LUMPUR COMPANY", "11th SIBU COMPANY", "11th K. KINABALU COMPANY"],
    "12": ["12th KUALA LUMPUR COMPANY", "12th SIBU COMPANY", "12th PENANG COMPANY", "12th K. KINABALU COMPANY"],
    "13": ["13th KUALA LUMPUR COMPANY", "13th K. KINABALU COMPANY", "13th KUCHING COMPANY"],
    "14": ["14th KUALA LUMPUR COMPANY", "14th SIBU COMPANY", "14th PENANG COMPANY", "14th KUCHING COMPANY"],
    "15": ["15th KUALA LUMPUR COMPANY", "15th SIBU COMPANY", "15th KUCHING COMPANY"],
    "16": ["16th KUALA LUMPUR COMPANY", "16th PENANG COMPANY", "16th KUCHING COMPANY"],
    "17": ["17th KUALA LUMPUR COMPANY", "17th KUCHING COMPANY"],
    "18": ["18th KUALA LUMPUR COMPANY", "18th PENANG COMPANY", "18th KUCHING COMPANY"],
    "19": ["19th KUALA LUMPUR COMPANY", "19th SIBU COMPANY", "19th K. KINABALU COMPANY"],
    "20": ["20th KUALA LUMPUR COMPANY", "20th SIBU COMPANY", "20th PENANG COMPANY"],
    "21": ["21st PENANG COMPANY"],
    "28": ["28th KUALA LUMPUR COMPANY"],
    "1s": ["1st KUALA LUMPUR COMPANY", "1st SIBU COMPANY"],
    "1st": ["1st KUALA LUMPUR COMPANY", "1st SIBU COMPANY"],
    "2nd": ["2nd KUALA LUMPUR COMPANY", "2nd SIBU COMPANY"],
    "3rd": ["3rd KUALA LUMPUR COMPANY"],
    "4th": ["4th KUALA LUMPUR COMPANY"],
    "5th": ["5th KUALA LUMPUR COMPANY"],
    "6th": ["6th KUALA LUMPUR COMPANY"],
    "7th": ["7th KUALA LUMPUR COMPANY"],
    "8th": ["8th KUALA LUMPUR COMPANY"],
    "9th": ["9th KUALA LUMPUR COMPANY"],
    "10th": ["10th KUALA LUMPUR COMPANY"],
    "11th": ["11th KUALA LUMPUR COMPANY"],
    "12th": ["12th KUALA LUMPUR COMPANY"],
    "13th": ["13th KUALA LUMPUR COMPANY"],
    "14th": ["14th KUALA LUMPUR COMPANY"],
    "15th": ["15th KUALA LUMPUR COMPANY"],
    "16th": ["16th KUALA LUMPUR COMPANY"],
    "17th": ["17th KUALA LUMPUR COMPANY"],
    "18th": ["18th KUALA LUMPUR COMPANY"],
    "19th": ["19th KUALA LUMPUR COMPANY"],
    "20th": ["20th KUALA LUMPUR COMPANY"],
    "28th": ["28th KUALA LUMPUR COMPANY"],
    "MELAKA": ["1st MELAKA COMPANY", "2nd MELAKA COMPANY", "3rd MELAKA COMPANY", "4th MELAKA COMPANY"],
    "MUAR": ["1st MUAR COMPANY"],
    "JOHOR": ["1st JOHOR BAHRU COMPANY", "4th JOHOR BAHRU COMPANY", "5th JOHOR BAHRU COMPANY"],
    "SEREMBAN": ["1st SEREMBAN COMPANY", "2nd SEREMBAN COMPANY"],
    "PENANG": ["1st PENANG COMPANY", "2nd PENANG COMPANY", "8th PENANG COMPANY", "12th PENANG COMPANY", "14th PENANG COMPANY", "16th PENANG COMPANY", "18th PENANG COMPANY", "19th PENANG COMPANY", "21st PENANG COMPANY"],
    "KUCHING": ["1st KUCHING COMPANY", "2nd KUCHING COMPANY", "3rd KUCHING COMPANY", "4th KUCHING COMPANY", "6th KUCHING COMPANY", "7th KUCHING COMPANY", "8th KUCHING COMPANY", "9th KUCHING COMPANY", "10th KUCHING COMPANY", "11th KUCHING COMPANY", "12th KUCHING COMPANY", "13th KUCHING COMPANY", "14th KUCHING COMPANY", "15th KUCHING COMPANY", "16th KUCHING COMPANY", "17th KUCHING COMPANY"],
    "BINTULU": ["1st BINTULU COMPANY", "2nd BINTULU COMPANY", "4th BINTULU COMPANY"],
    "K. KINABALU": ["2nd K. KINABALU COMPANY", "3rd K. KINABALU COMPANY", "4th K. KINABALU COMPANY", "11th K. KINABALU COMPANY", "12th K. KINABALU COMPANY", "13th K. KINABALU COMPANY", "19th K. KINABALU COMPANY"],
    "SANDAKAN": ["1st SANDAKAN COMPANY", "2nd SANDAKAN COMPANY", "5th SANDAKAN COMPANY"],
    "TAWAU": ["1st TAWAU COMPANY", "2nd TAWAU COMPANY", "3rd TAWAU COMPANY"],
    "PITAS": ["1st PITAS COMPANY", "2nd PITAS COMPANY", "3rd PITAS COMPANY"],
    "SARIKEI": ["1st SARIKEI COMPANY", "3rd SARIKEI COMPANY"],
    "MIRI": ["1st MIRI COMPANY", "2nd MIRI COMPANY", "3rd MIRI COMPANY", "4th MIRI COMPANY", "5th MIRI COMPANY", "6th MIRI COMPANY", "7th MIRI COMPANY"],
    "PETALING JAYA": ["1st PETALING JAYA COMPANY", "4th PETALING JAYA COMPANY", "5th PETALING JAYA COMPANY", "7th PETALING JAYA COMPANY", "8th PETALING JAYA COMPANY", "9th PETALING JAYA COMPANY"],
    "PENAMPANG": ["1st PENAMPANG COMPANY"],
    "PENANG": ["1st PENANG COMPANY", "2nd PENANG COMPANY", "8th PENANG COMPANY", "12th PENANG COMPANY", "14th PENANG COMPANY", "16th PENANG COMPANY", "18th PENANG COMPANY", "19th PENANG COMPANY", "21st PENANG COMPANY"],
    "PENGKALAN KEMPAS": ["1st PENGKALAN KEMPAS COMPANY"],
    "PITAS": ["1st PITAS COMPANY", "2nd PITAS COMPANY", "3rd PITAS COMPANY"],
    "PUCHONG": ["1st PUCHONG COMPANY", "2nd PUCHONG COMPANY"],
    "PUTRAJAYA": ["1st PUTRAJAYA COMPANY"]
  };

  if (companyEl) {
    companyEl.addEventListener('input', function () {
      const input = this.innerText.toUpperCase().trim();
      listEl.innerHTML = '';
      if (!input) { listEl.style.display = 'none'; return; }
      const matches = Object.keys(suggestionsMap)
        .filter(k => k.toUpperCase().startsWith(input))
        .flatMap(k => suggestionsMap[k]);
      if (matches.length) {
        matches.forEach(s => {
          const d = document.createElement('div');
          d.textContent = s;
          d.className = 'autocomplete-suggestion';
          d.addEventListener('mousedown', () => {
            companyEl.innerText = s;
            listEl.style.display = 'none';
          });
          listEl.appendChild(d);
        });
        listEl.style.display = 'block';
      } else {
        listEl.style.display = 'none';
      }
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('#nametag-company') && !e.target.closest('#autocomplete-list'))
      listEl.style.display = 'none';
  });
})();


/* Support Popup Toggle */
(function supportPopup() {
  const btn = document.getElementById('supportBtn');
  const popup = document.getElementById('support-popup');
  const close = document.getElementById('supportClose');

  if (btn && popup && close) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      popup.style.display = 'flex';
      requestAnimationFrame(() => popup.classList.add('show'));
    });

    const closePopup = () => {
      popup.classList.remove('show');
      setTimeout(() => { popup.style.display = 'none'; }, 300);
    };

    close.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
  }
})();

/* HD Logo Popup Toggle */
(function hdLogoPopup() {
  const btns = document.querySelectorAll('#main-logo, #footer-logo');
  const popup = document.getElementById('hd-logo-popup');

  if (btns.length && popup) {
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        popup.style.display = 'flex';
        requestAnimationFrame(() => popup.classList.add('show'));
      });
    });

    const closePopup = () => {
      popup.classList.remove('show');
      setTimeout(() => { popup.style.display = 'none'; }, 300);
    };

    popup.addEventListener('click', closePopup); // Clicking anywhere on it closes it
  }
})();

/* Mobile Nav Toggle */
(function mobileNavToggle() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('tab-nav-scroll');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
    nav.querySelectorAll('.tab-btn').forEach(tbtn => {
      tbtn.addEventListener('click', () => nav.classList.remove('show'));
    });
  }
})();

/* ══════════════════════════════════════════════════════════
   12. INIT
   ══════════════════════════════════════════════════════════ */
(function init() {
  document.body.dataset.activeTab = 'arrangement';
  buildSelectorContent(document.getElementById('sidebar-body'));
  buildSelectorContent(document.getElementById('sheet-body'));
  buildResources();
  renderRequirements();
  initJourneyPuzzle();
  BadgeState.subscribe(render);
  render(BadgeState.getState());
  renderHistory();

  // Game Setup
  setupLvlPills('sheep-lvl-pills', (l) => sheepInit(l));
  setupLvlPills('badgematch-lvl-pills', (l) => bmInit(l));
  setupLvlPills('drift-lvl-pills', (l) => driftInit(l));
  setupLvlPills('sash-lvl-pills', (l) => sashInit(l));
  setupLvlPills('seqmem-lvl-pills', (l) => seqInit(l));
  setupLvlPills('puzzle-lvl-pills', (l) => initPuzzle());
})();

/* ══════════════════════════════════════════════════════════
   13. GAME HISTORY SYSTEM
   ══════════════════════════════════════════════════════════ */
function saveGameRecord(game, lvl, won, detail) {
  const history = JSON.parse(localStorage.getItem('bb_game_history') || '[]');
  const record = {
    game,
    lvl,
    won,
    detail,
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  history.unshift(record);
  localStorage.setItem('bb_game_history', JSON.stringify(history.slice(0, 50))); // Keep last 50
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  const history = JSON.parse(localStorage.getItem('bb_game_history') || '[]');
  if (history.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;opacity:0.5;font-size:13px;">No game records yet.</div>';
    return;
  }
  list.innerHTML = history.map(h => `
    <div class="history-item">
      <div class="history-item-top">
        <span class="history-game">${h.game} (Lvl ${h.lvl})</span>
        <span class="history-res ${h.won ? 'win' : 'lose'}">${h.won ? 'WIN' : 'LOST'}</span>
      </div>
      <div class="history-date">${h.date}</div>
      <div class="history-details">${h.detail || ''}</div>
    </div>
  `).join('');
}

document.getElementById('show-history-btn').addEventListener('click', () => {
  document.getElementById('history-modal').classList.add('open');
});
document.getElementById('history-close').addEventListener('click', () => {
  document.getElementById('history-modal').classList.remove('open');
});
document.getElementById('clear-history-btn').addEventListener('click', () => {
  if (confirm('Clear all game records?')) {
    localStorage.removeItem('bb_game_history');
    renderHistory();
  }
});
