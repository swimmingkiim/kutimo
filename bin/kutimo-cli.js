#! /usr/bin/env node

import createFromTemplate from "kutimo-create";

const action = process.argv[2];

if (action === "create") {
    const projectName = process.argv[3];
    if (projectName !== null && projectName !== undefined) {
        console.log(`Start creating ${projectName} with kutimo template...`);
        createFromTemplate(projectName);
    } else {
        console.log("You should provide a project name, lik this \"kutimo create test-project\"")
    }
}
