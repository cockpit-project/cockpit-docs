// SPDX-License-Identifier: GPL-3.0-or-later
'use strict'

/**
 * Looks through versions of the sources and marks the latest minor version
 * as the version itself while also removing other minor versions of that major
 * version and removing the original major version.
 *
 * Example:
 *  Cockpit 363 and 363.1 is removed.
 *  Cockpit 363.2 becomes 363.
 */
export function register () {
  const logger = this.getLogger('last-minor-version')

  this.once("contentAggregated", ({ contentAggregate }) => {
    const versionMapping = {};
    for (const bucket of contentAggregate) {
      const versionMatch = bucket.version.match(/(\d+)\.\d+/);
      if (versionMatch) {
        if (Object.hasOwn(versionMapping, versionMatch[1])) {
          versionMapping[versionMatch[1]].unshift(versionMatch[0]);
        } else {
          versionMapping[versionMatch[1]] = [versionMatch[0]];
        }
      }
    }

    const versions = Object.entries(versionMapping);

    if (versions.length <= 0) {
      logger.debug(`No releases with minor versions found`)
      return;
    }
    logger.debug(`Release map: ${JSON.stringify(versionMapping)}`)

    this.updateVariables({
      contentAggregate: contentAggregate.reduce((filtered, bucket) => {
        let shouldAdd = true;
        for (const [version, minorVersions] of versions) {
          if (bucket.version === minorVersions[0]) {
            logger.info(`Replacing '${minorVersions[0]}' with '${version}'`)
            bucket.version = version;
            break;
          }
          else if ((bucket.version === version || minorVersions.includes(bucket.version))) {
            logger.info(`Removing '${bucket.version}' from version in favor of '${minorVersions[0]}'`)
            shouldAdd = false
          }
        }
        if (shouldAdd) {
          filtered.push(bucket)
        };
        return filtered;
      }, [])
    });
  });
}
