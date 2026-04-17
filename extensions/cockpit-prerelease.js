// SPDX-License-Identifier: GPL-3.0-or-later
'use strict'

const MAIN_BRANCH = "main";

/**
 * Mark main branch (and asciidoc-guide during devel) as prerelease branches
 */
export function register () {
  const logger = this.getLogger('cockpit-prerelease')
  this.once("contentClassified", ({ contentCatalog }) => {
    let updatedLatest = false;
    contentCatalog.getComponents().forEach((component) => {
      component.versions.forEach((componentVersion) => {
        logger.info(`${componentVersion.version}@${componentVersion.name} attributes (compiled)`);
        if (componentVersion.version === MAIN_BRANCH) {
          logger.info(`${componentVersion.version}@${componentVersion.name} setting prerelease`);
          componentVersion.prerelease = true;
        } else if (!updatedLatest) {
          logger.info(`${componentVersion.version}@${componentVersion.name} set as latest`);
          component.latest = componentVersion;
          updatedLatest = true;
        }
      });
    });
    this.updateVariables({ contentCatalog });
  });
}
