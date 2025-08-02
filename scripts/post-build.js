const fs = require('fs');
const path = require('path');

// Post-build script to add cache-busting and versioning
console.log('Running post-build optimizations...');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');

try {
  // Read the built index.html
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Generate a unique version timestamp
  const version = Date.now();
  const buildDate = new Date().toISOString();

  // Update the app version in the cache-clearing script
  indexHtml = indexHtml.replace(
    /const e="[^"]*"/,
    `const e="v${version}"`
  );

  // Add build info as meta tags
  const buildInfo = `
    <meta name="build-version" content="v${version}" />
    <meta name="build-date" content="${buildDate}" />
    <meta name="cache-control" content="no-cache, no-store, must-revalidate" />`;

  indexHtml = indexHtml.replace(
    '<meta name="theme-color" content="#101a23" />',
    `<meta name="theme-color" content="#101a23" />${buildInfo}`
  );

  // Write the updated index.html
  fs.writeFileSync(indexHtmlPath, indexHtml);

  // Create a version.json file for deployment tracking
  const versionInfo = {
    version: `v${version}`,
    buildDate: buildDate,
    timestamp: version,
    branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    message: 'Build with cache-busting enabled'
  };

  fs.writeFileSync(
    path.join(buildDir, 'version.json'),
    JSON.stringify(versionInfo, null, 2)
  );

  console.log(`✅ Post-build completed successfully!`);
  console.log(`   Version: ${versionInfo.version}`);
  console.log(`   Build Date: ${buildDate}`);
  console.log(`   Cache-busting: Enabled`);

} catch (error) {
  console.error('❌ Post-build script failed:', error);
  process.exit(1);
}
