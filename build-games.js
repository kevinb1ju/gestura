#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the games to build
const games = [
  {
    name: 'numbers',
    sourcePath: './client/games/numbers',
    buildPath: './client/games/numbers/build',
    outputPath: './client/public/games/numbers'
  },
  {
    name: 'bridge',
    sourcePath: './client/games/bridge',
    buildPath: './client/games/bridge/build',
    outputPath: './client/public/games/bridge'
  },
  {
    name: 'rupee-buddy',
    sourcePath: './client/games/rupee-buddy',
    buildPath: './client/games/rupee-buddy/build',
    outputPath: './client/public/games/rupee-buddy'
  },
  {
    name: 'rupee-buddy-voc',
    sourcePath: './client/games/rupee-buddy-voc',
    buildPath: './client/games/rupee-buddy-voc/build',
    outputPath: './client/public/games/rupee-buddy-voc'
  }
];

console.log('🎮 Building React games for instant loading...\n');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'client/public/games');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✅ Created output directory:', outputDir);
}

games.forEach((game, index) => {
  console.log(`\n📦 Building game ${index + 1}/${games.length}: ${game.name}`);
  
  try {
    // Check if source directory exists
    if (!fs.existsSync(path.join(__dirname, game.sourcePath))) {
      console.log(`⚠️  Source directory not found: ${game.sourcePath}`);
      return;
    }

    // Check if package.json exists
    const packageJsonCheckPath = path.join(__dirname, game.sourcePath, 'package.json');
    if (!fs.existsSync(packageJsonCheckPath)) {
      console.log(`⚠️  package.json not found: ${packageJsonCheckPath}`);
      return;
    }

    // Install dependencies if node_modules doesn't exist
    const nodeModulesPath = path.join(__dirname, game.sourcePath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 Installing dependencies...');
      execSync('npm install', { 
        cwd: path.join(__dirname, game.sourcePath),
        stdio: 'inherit'
      });
    }

    // Update package.json to set correct homepage
    const packageJsonPath = path.join(__dirname, game.sourcePath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.homepage = `/games/${game.name}/`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Handle Vite base path for games that use Vite
    const viteConfigPath = path.join(__dirname, game.sourcePath, 'vite.config.js');
    if (fs.existsSync(viteConfigPath)) {
      console.log('🔧 Configuring Vite base path...');
      const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/games/${game.name}/',
  build: {
    outDir: 'dist'
  }
})`;
      fs.writeFileSync(viteConfigPath, viteConfig);
    }

    // Build the game
    console.log('🔨 Building game...');
    execSync('npm run build', { 
      cwd: path.join(__dirname, game.sourcePath),
      stdio: 'inherit'
    });

    // Check if build was successful (handle both build and dist directories)
    const buildDir = path.join(__dirname, game.buildPath);
    const distDir = path.join(__dirname, game.sourcePath, 'dist');
    let actualBuildDir = buildDir;
    
    if (!fs.existsSync(buildDir) && fs.existsSync(distDir)) {
      actualBuildDir = distDir;
      console.log('📁 Using Vite build directory (dist)');
    }
    
    if (!fs.existsSync(actualBuildDir)) {
      console.log(`❌ Build failed - build directory not found: ${actualBuildDir}`);
      return;
    }

    // Remove existing output directory if it exists
    const outputGameDir = path.join(__dirname, game.outputPath);
    if (fs.existsSync(outputGameDir)) {
      fs.rmSync(outputGameDir, { recursive: true, force: true });
    }

    // Copy build files to public directory
    fs.mkdirSync(outputGameDir, { recursive: true });
    copyFolderSync(actualBuildDir, outputGameDir);

    console.log(`✅ Successfully built ${game.name}!`);
    console.log(`   📁 Available at: /games/${game.name}/index.html`);

  } catch (error) {
    console.error(`❌ Error building ${game.name}:`, error.message);
  }
});

console.log('\n🎉 Build process completed!');
console.log('\n📋 Summary:');
games.forEach(game => {
  const outputPath = path.join(__dirname, game.outputPath, 'index.html');
  if (fs.existsSync(outputPath)) {
    console.log(`✅ ${game.name}: /games/${game.name}/index.html`);
  } else {
    console.log(`❌ ${game.name}: Build failed`);
  }
});

console.log('\n🚀 All games are now ready for instant loading!');

function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolderSync(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}
