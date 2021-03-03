import * as semver from 'semver';

const requirement = '1.x.x';

const versionList = ['1.2.3', '2.3.0', '3.4.0'];
if (semver.validRange(requirement)) {
    const result = semver.maxSatisfying(versionList, requirement);
    if (result) {
        console.log(result);
    } else {
        console.log(`No satisfied version found in [${versionList.join(', ')}].`);
    }
} else {
    console.log(`Invalid requirement ${requirement}.`);
}