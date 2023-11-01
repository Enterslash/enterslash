const fs = require('fs');

const updateConfig = ({ base_url }) => {
  const filePath = '../../../libs/enterus/utils/src/env.ts';

  const contentToWrite = `
    export const base_url = "${base_url}"
  `;

  fs.writeFile(filePath, contentToWrite, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`Successfully updated the config to`, contentToWrite);
    }
  });
};

const args = process.argv.slice(2);

if (args.includes('--production')) {
  updateConfig({
    base_url: 'http://103.49.170.241:9090',
  });
}

if (args.includes('--android')) {
  updateConfig({
    base_url: 'http://10.0.2.2:9090',
  });
}

if (args.includes('--ios')) {
  updateConfig({
    base_url: 'http://localhost:9090',
  });
}
