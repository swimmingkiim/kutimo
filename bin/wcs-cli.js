#! /usr/bin/env node

import shell from "shelljs";
import createFromTemplate from "wcs-create";

const action = process.argv[2];

if (action === "create") {
    const projectName = process.argv[3];
    console.log(`Start creating ${projectName} with wcs template...`);
    console.log("root pwd");
    shell.exec("pwd");
    createFromTemplate(projectName);
}
