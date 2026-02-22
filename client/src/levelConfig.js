// Level Configuration for Gestura Educational System
export const LEVEL_CONFIG = {
  1: {
    name: "Preprimary",
    description: "Early learning fundamentals",
    games: ["Egg Hunt"]
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

export const GAME_DETAILS = {
  "Egg Hunt": {
    title: "Egg Hunt Gestura",
    path: "/games/egg-hunt/index.html",
    type: "html",
    port: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgvxl4b6N-rKGSZShGEFKmQSFp_69x0eDElpIXzoHf2PCn2cT60symPYrKLch-Jrs6eNz3mrRFaIQNscsvaj86Gkc6hhnLySJEUPMbVS3Ll8cLlAZb4iB4uyWDKhe19NKbNuZFa072AgiMNPqVcNxpUQoLDFRBM5WMe6OmhW9Rb3hDJ_Eo7h6eD6HzH2h374hTJYOSWSGPWDVzTxpl9Bjy8JxucDnGJW8uYhbsX86j6gFTHHw8x1by-duHEnfKjgM6Eg82bjHVvjTc",
    bgColor: "#ffda79",
    buttonColor: "#3498db"
  },
  "Shape Explorers": {
    title: "Shape Explorers",
    path: "/games/shape/index.html", 
    type: "html",
    port: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0gEQX57-Dh8Q_dDlu0hW-nGJWqly_fVfyPuj6xweqOGw00zG8oj4Tdl4yaW9Mkghx6cJ5no5J6GKmS-bAcQCWQsZhKA0fJN04wdoDX61PgYX0X_-_9_66SRJ3JJw7w_UMuwxidWaBIghb2D8BIoUqj8_YE6LUACui1lR6OXu6qQjOUUxvhfopnEUNT___oQSZt5AP_gmBspIMKzsXjzo7DvVnsWFA4byUKbLr-T8eCDZOvVdbWi9mq27_S19EaaU3IMG-LlYjJJRp",
    bgColor: "#7ed6df",
    buttonColor: "#ff6b6b"
  },
  "Color Quest": {
    title: "Color Quest",
    path: "/games/colors/index.html",
    type: "html",
    port: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoTYAh1s0OUXa9u-AuQAFlTW9SG4wuy5lBKfyd5c5FKmadr6oVtbGZpfQs-V_-INgQHn-FjI6dr9-_R9VQvKb3PhoUCXyuthDut_AcI-aNQjDual1XoEnmkYAkfiKQfLQV3Ru4g7KSBjTQcL6GRFVtE2suzY-GRHiMB3uR53tXT_S02PxGgMR3XCiwvxR6bUbM-70aExB8voHUSlvfWEbw3KO65TgPfRt04KJGjK5QMv4DNe_HIrSwfACFtLL1xRDxslxDhCXJ8Dsj",
    bgColor: "#82ccdd", 
    buttonColor: "#f9d423"
  },
  "Number Adventures": {
    title: "Number Adventures",
    path: "./games/numbers",
    type: "react",
    port: 3001,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgvxl4b6N-rKGSZShGEFKmQSFp_69x0eDElpIXzoHf2PCn2cT60symPYrKLch-Jrs6eNz3mrRFaIQNscsvaj86Gkc6hhnLySJEUPMbVS3Ll8cLlAZb4iB4uyWDKhe19NKbNuZFa072AgiMNPqVcNxpUQoLDFRBM5WMe6OmhW9Rb3hDJ_Eo7h6eD6HzH2h374hTJYOSWSGPWDVzTxpl9Bjy8JxucDnGJW8uYhbsX86j6gFTHHw8x1by-duHEnfKjgM6Eg82bjHVvjTc",
    bgColor: "#a8e6cf",
    buttonColor: "#ff8b94"
  },
  "Bridge Game": {
    title: "Bridge Game",
    path: "./games/bridge",
    type: "react",
    port: 3002,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgvxl4b6N-rKGSZShGEFKmQSFp_69x0eDElpIXzoHf2PCn2cT60symPYrKLch-Jrs6eNz3mrRFaIQNscsvaj86Gkc6hhnLySJEUPMbVS3Ll8cLlAZb4iB4uyWDKhe19NKbNuZFa072AgiMNPqVcNxpUQoLDFRBM5WMe6OmhW9Rb3hDJ_Eo7h6eD6HzH2h374hTJYOSWSGPWDVzTxpl9Bjy8JxucDnGJW8uYhbsX86j6gFTHHw8x1by-duHEnfKjgM6Eg82bjHVvjTc",
    bgColor: "#ffd3b6",
    buttonColor: "#ffaaa5"
  },
  "Rupee Buddy": {
    title: "Rupee Buddy",
    path: "./games/rupee-buddy",
    type: "react",
    port: 3003,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgvxl4b6N-rKGSZShGEFKmQSFp_69x0eDElpIXzoHf2PCn2cT60symPYrKLch-Jrs6eNz3mrRFaIQNscsvaj86Gkc6hhnLySJEUPMbVS3Ll8cLlAZb4iB4uyWDKhe19NKbNuZFa072AgiMNPqVcNxpUQoLDFRBM5WMe6OmhW9Rb3hDJ_Eo7h6eD6HzH2h374hTJYOSWSGPWDVzTxpl9Bjy8JxucDnGJW8uYhbsX86j6gFTHHw8x1by-duHEnfKjgM6Eg82bjHVvjTc",
    bgColor: "#dcedc8",
    buttonColor: "#81c784"
  },
  "Rupee Buddy Vocational": {
    title: "Rupee Buddy Vocational",
    path: "./games/rupee-buddy-voc",
    type: "react",
    port: 3004,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgvxl4b6N-rKGSZShGEFKmQSFp_69x0eDElpIXzoHf2PCn2cT60symPYrKLch-Jrs6eNz3mrRFaIQNscsvajaj86Gkc6hhnLySJEUPMbVS3Ll8cLlAZb4iB4uyWDKhe19NKbNuZFa072AgiMNPqVcNxpUQoLDFRBM5WMe6OmhW9Rb3hDJ_Eo7h6eD6HzH2h374hTJYOSWSGPWDVzTxpl9Bjy8JxucDnGJW8uYhbsX86j6gFTHHw8x1by-duHEnfKjgM6Eg82bjHVvjTc",
    bgColor: "#f8bbd0",
    buttonColor: "#e91e63"
  }
};

export const getLevelName = (level) => {
  return LEVEL_CONFIG[level]?.name || `Level ${level}`;
};

export const getGamesForLevel = (level) => {
  const levelConfig = LEVEL_CONFIG[level];
  if (!levelConfig) return [];
  
  return levelConfig.games.map(gameName => ({
    ...GAME_DETAILS[gameName],
    name: gameName
  })).filter(game => game.title); // Filter out games without details
};

export const launchGame = (game) => {
  console.log('Launching game:', game);
  
  if (game.type === 'html') {
    // For HTML games, open directly in new tab
    const fullPath = game.path;
    console.log('HTML game path:', fullPath);
    
    try {
      window.open(fullPath, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    } catch (error) {
      console.error('Error opening HTML game:', error);
      alert(`To play ${game.title}:\n\nPlease open this URL in your browser:\n${window.location.origin}${fullPath}`);
    }
    
  } else if (game.type === 'react' && game.port) {
    // For React games, start server and open
    const gameUrl = `http://localhost:${game.port}`;
    console.log('React game URL:', gameUrl);
    
    // Check if server is already running
    fetch(gameUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        } else {
          startReactGameServer(game);
        }
      })
      .catch(() => {
        startReactGameServer(game);
      });
  }
};

const startReactGameServer = (game) => {
  // Show loading message
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                background: white; padding: 20px; border-radius: 10px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999;">
      <h3>Starting ${game.title}...</h3>
      <p>Please wait while the game server starts...</p>
      <div style="margin: 10px 0;">
        <div style="border: 2px solid #f3f3f3; border-radius: 5px; padding: 5px;">
          <div style="background: #4CAF50; height: 10px; border-radius: 3px; 
                      animation: pulse 1.5s infinite;"></div>
        </div>
      </div>
      <p style="font-size: 12px; color: #666;">This may take 30-60 seconds...</p>
      <div style="margin-top: 15px;">
        <button id="continue-waiting" style="background: #4CAF50; color: white; 
                border: none; padding: 8px 16px; border-radius: 4px; 
                cursor: pointer; margin-right: 10px;">Continue Waiting</button>
        <button id="cancel-start" style="background: #f44336; color: white; 
                border: none; padding: 8px 16px; border-radius: 4px; 
                cursor: pointer;">Cancel</button>
      </div>
    </div>
    <style>
      @keyframes pulse {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
    </style>
  `;
  document.body.appendChild(loadingDiv);
  
  // Add event listeners to buttons
  const continueBtn = loadingDiv.querySelector('#continue-waiting');
  const cancelBtn = loadingDiv.querySelector('#cancel-start');
  
  continueBtn.addEventListener('click', () => {
    // Continue waiting and check again
    setTimeout(() => {
      fetch(`http://localhost:${game.port}`, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            document.body.removeChild(loadingDiv);
            window.open(`http://localhost:${game.port}`, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
          } else {
            document.body.removeChild(loadingDiv);
            alert(`Server is still starting. Please try again in a moment or start manually:\n\ncd ${game.path}\nnpm start`);
          }
        })
        .catch(() => {
          document.body.removeChild(loadingDiv);
          alert(`Server is still starting. Please try again in a moment or start manually:\n\ncd ${game.path}\nnpm start`);
        });
    }, 30000); // Check again after 30 seconds
  });
  
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(loadingDiv);
  });
  
  // Auto-hide loading after 2 minutes and show manual instructions
  setTimeout(() => {
    if (document.body.contains(loadingDiv)) {
      document.body.removeChild(loadingDiv);
      alert(`Game startup is taking longer than expected. Please start manually:\n\n1. Open terminal/command prompt\n2. Navigate to: ${game.path}\n3. Run: npm start\n4. Game will open at http://localhost:${game.port}`);
    }
  }, 120000); // 2 minutes
};

const showGameInstructions = (game) => {
  const instructions = game.type === 'react' 
    ? `To play ${game.title}:\n\n1. Open terminal/command prompt\n2. Navigate to: ${game.path}\n3. Run: npm start\n4. Game will open at http://localhost:${game.port}\n\nThen click Play Now again.`
    : `To play ${game.title}:\n\nPlease open the file directly:\n${game.path}`;
  
  alert(instructions);
};
