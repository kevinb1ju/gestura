// Level Configuration for Gestura Educational System
export const LEVEL_CONFIG = {
  1: {
    name: "Preprimary",
    description: "Early learning fundamentals",
    games: ["Egg Hunt", "Pop Game"]
  },
  2: {
    name: "Primary", 
    description: "Basic concepts learning",
    games: ["Shape Explorers", "Color Quest", "Number Adventures"]
  },
  3: {
    name: "Bridge",
    description: "Transitional learning activities",
    games: ["Bridge Game"]
  },
  4: {
    name: "Pre-Vocational",
    description: "Skill building activities",
    games: ["Rupee Buddy"]
  },
  5: {
    name: "Vocational",
    description: "Advanced vocational training",
    games: ["Rupee Buddy Vocational"]
  }
};

// Test version - simplified GAME_DETAILS with simple images
export const GAME_DETAILS = {
  "Egg Hunt": {
    title: "Egg Hunt Gestura",
    path: "/games/egg-hunt/index.html",
    type: "html",
    port: null,
    img: "🥚",
    bgColor: "#ffda79",
    buttonColor: "#3498db"
  },
  "Pop Game": {
    title: "Pop Game",
    path: "/games/pop-game/index.html",
    type: "html",
    port: null,
    img: "🎈",
    bgColor: "#fbbf24",
    buttonColor: "#f59e0b"
  },
  "Shape Explorers": {
    title: "Shape Explorers",
    path: "/games/shape/index.html", 
    type: "html",
    port: null,
    img: "🔷",
    bgColor: "#7ed6df",
    buttonColor: "#ff6b6b"
  },
  "Color Quest": {
    title: "Color Quest",
    path: "/games/colors/index.html",
    type: "html",
    port: null,
    img: "🎨",
    bgColor: "#82ccdd", 
    buttonColor: "#f9d423"
  },
  "Number Adventures": {
    title: "Number Adventures",
    path: "/games/numbers/index.html",
    type: "html",
    port: null,
    img: "🔢",
    bgColor: "#a8e6cf",
    buttonColor: "#ff8b94"
  },
  "Bridge Game": {
    title: "Bridge Game",
    path: "/games/bridge/index.html",
    type: "html",
    port: null,
    img: "🌉",
    bgColor: "#ffd3b6",
    buttonColor: "#ffaaa5"
  },
  "Rupee Buddy": {
    title: "Rupee Buddy",
    path: "/games/rupee-buddy/index.html",
    type: "html",
    port: null,
    img: "💰",
    bgColor: "#dcedc8",
    buttonColor: "#81c784"
  },
  "Rupee Buddy Vocational": {
    title: "Rupee Buddy Vocational",
    path: "/games/rupee-buddy-voc/index.html",
    type: "html",
    port: null,
    img: "💼",
    bgColor: "#e1bee7",
    buttonColor: "#ba68c8"
  }
};

export const getLevelName = (level) => {
  return LEVEL_CONFIG[level]?.name || `Level ${level}`;
};

export const getGamesForLevel = (level) => {
  console.log('Getting games for level:', level);
  console.log('GAME_DETAILS keys:', Object.keys(GAME_DETAILS));
  console.log('Bridge Game in GAME_DETAILS:', 'Bridge Game' in GAME_DETAILS);
  
  // Direct test
  console.log('Direct access test:', GAME_DETAILS['Bridge Game']);
  console.log('Stringified Bridge Game:', JSON.stringify(GAME_DETAILS['Bridge Game']));
  
  const levelConfig = LEVEL_CONFIG[level];
  console.log('Level config:', levelConfig);
  
  if (!levelConfig) {
    console.log('No level config found for level:', level);
    return [];
  }
  
  console.log('Games in level config:', levelConfig.games);
  
  const games = levelConfig.games.map(gameName => {
    console.log('Looking for game:', gameName);
    console.log('Game details:', GAME_DETAILS[gameName]);
    return {
      ...GAME_DETAILS[gameName],
      name: gameName
    };
  }).filter(game => {
    console.log('Filtering game:', game);
    return game.title;
  });
  
  console.log('Final games array:', games);
  return games;
};

export const launchGame = (game) => {
  console.log('Launching game:', game);
  
  // Get current student data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.studentId || 'DEMO_STUDENT';
  
  // All games are now HTML type, open directly in new tab
  const fullPath = game.path;
  console.log('Game path:', fullPath);
  console.log('Student ID:', studentId);
  console.log('Full URL:', window.location.origin + fullPath);
  
  try {
    // Open game with student ID as URL parameter
    const gameUrl = `${fullPath}?studentId=${studentId}`;
    const newWindow = window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    // Check if popup was blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked, provide alternative
      alert(`Popup blocked! To play ${game.title}:\n\nPlease open this URL manually:\n${window.location.origin}${gameUrl}\n\nOr right-click the game button and choose "Open in new tab".`);
    } else {
      console.log('Game opened successfully with student ID:', studentId);
    }
  } catch (error) {
    console.error('Error opening game:', error);
    const gameUrl = `${fullPath}?studentId=${studentId}`;
    alert(`To play ${game.title}:\n\nPlease open this URL in your browser:\n${window.location.origin}${gameUrl}`);
  }
};
