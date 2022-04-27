import * as core from '@actions/core';
import * as setup from './setup-cmake';
import * as version from './version';

async function run() {
  try {
    const requested_version = core.getInput('cmake-version');
    const required_version =
      requested_version === 'latest' ? '' : requested_version;
    const api_token = core.getInput('github-api-token');
    const all_version_info = await version.getAllVersionInfo(api_token);
    const chosen_version_info = version.getLatestMatching(
      required_version,
      all_version_info
    );

    const arch = core.getInput('architecture') || 'x64';

    await setup.addCMakeToPath(chosen_version_info, arch);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}
run();
