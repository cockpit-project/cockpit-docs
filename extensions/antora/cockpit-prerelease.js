// SPDX-License-Identifier: GPL-3.0-or-later
'use strict'

const MAIN_BRANCH = "main";

/**
 * Mark branches as prerelease
 */
export function register () {
  const logger = this.getLogger('cockpit-prerelease')
  this.once("contentAggregated", ({ contentAggregate }) => {
    for (const bucket of contentAggregate) {
      for (const origin of bucket.origins) {
        if (origin.reftype === "branch") {
          logger.info(`Setting prerelease for branch '${origin.refname}', for source '${origin.startPath}'`)
          bucket.prerelease = true;
          break;
        }
      }
    }
    this.updateVariables({ contentAggregate })
  });

  this.once("contentClassified", ({ contentCatalog }) => {
    let updatedLatest = false;
    contentCatalog.getComponents().forEach((component) => {
      component.versions.forEach((componentVersion) => {
        if (componentVersion.prerelease) {
          componentVersion.displayVersion = `git+${componentVersion.displayVersion}`
        }
      });
    });
  });
}
