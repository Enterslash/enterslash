const fs = require('fs');

// const setConfig = (url) => {
//   const envPath = '../../../libs/enterus/utils/src/env.ts';
//   try {
//     const envFileContent = fs.readFileSync(envPath, 'utf8');
//     const updatedEnvFileContent = envFileContent.replace(
//       /export const base_url = .*/i,
//       `export const base_url = '${url}'`
//     );
//     fs.writeFileSync(envPath, updatedEnvFileContent, 'utf8');
//     console.log(`Successfully set config to use ${url}.`);
//   } catch (err) {
//     console.error('Error setting config:', err);
//   }
// };

const updateConfig = ({ base_url, publishable_key, merchant_identifier }) => {
  const filePath = '../../../libs/enterus/utils/src/env.ts';

  const contentToWrite = `
    export const base_url = "${base_url}"
    export const publishable_key = "${publishable_key}"
    export const merchant_identifier = "${merchant_identifier}"
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
    base_url: 'https://enterus.onrender.com',
    publishable_key: 'pk_live_E0EHnwODPxPan3QHPOnbD65H',
    merchant_identifier: 'merchant.com.enterslash.enterus',
  });
}

if (args.includes('--android')) {
  updateConfig({
    base_url: 'http://10.0.2.2:9090',
    publishable_key: 'pk_test_6CEzgyDd7cvLPP5Nln4VnUtK',
    merchant_identifier: 'merchant.com.enterslash.enterus',
  });
}

if (args.includes('--ios')) {
  updateConfig({
    base_url: 'http://localhost:9090',
    publishable_key: 'pk_test_6CEzgyDd7cvLPP5Nln4VnUtK',
    merchant_identifier: 'merchant.com.enterslash.enterus',
  });
}
