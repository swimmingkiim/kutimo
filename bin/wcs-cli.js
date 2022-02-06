#! /usr/bin/env node

import createFromTemplate from "wcs-create";

const action = process.argv[2];

if (action === "create") {
    const projectName = process.argv[3];
    if (projectName !== null && projectName !== undefined) {
        console.log(`Start creating ${projectName} with wcs template...`);
        createFromTemplate(projectName);
    } else {
        console.log("You should provide a project name, lik this \"wcs create test-project\"")
    }
}
