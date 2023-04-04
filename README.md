# MWS - Modular Working Space

A command line to organize some repositories under a centralized repository.

## One More Option

- Different from git submodules you can manage every project as a normal git repo.

- Different from mono repo you can create some repositories for you project and manage them centralized.

## Install

using npm

    $ npm i -g @co2-lab/mws

using yarn

    $ yarn global add @co2-lab/mws

using pnpm

    $ pnpm add -g @co2-lab/mws

## How it works

You wanna create some repositories for your project...

example:

    https://github.com/co2-lab/module-1
    https://github.com/co2-lab/module-2

but you wanna manager all of then on the same IDE instance like a workspace, then you can create a centralizer repo.

You can create a git repo using the mws cli or using a existing git repo. For now let's consider the scenario of you create a git repo using the mws cli...

In any folder run the command **`mws create`** and answer the questions...

example:

    $ mws create --verbose
    $ What will be the workspace name ? my-project-workspace
    $ What will be the name of the repositories folder ? modules
    $ Do you want to push it to github ? yes
    $ What Github password or Personal Access Token can I use ? *******
    $ What will be the Github project name ? my-project-workspace
    $ Do you want to make the repo private ? no
    $ Starting workspace creation...
    $ Creating github repo...
    $ Done...

This command will create a folder named my-project-workspace with the mws config file inside, create a git repo named my-project-workspace (`https://github.com/co2-lab/my-project-workspace`) and push the content to the created repository.

Now, all you need to do is add the modules to your new workspace.

example:

    $ mws add-repo --verbose
    $ What is the git url of the repo that you want to clone ? https://github.com/co2-lab/module-1
    $ What should be the folder name where it should be cloned ? module-1
    $ Connect to ... ? Branch
    $ pull from ... ? main
    $ Starting to add a repo...
    $ Done...

    $ mws add-repo --verbose
    $ What is the git url of the repo that you want to clone ? https://github.com/co2-lab/module-2
    $ What should be the folder name where it should be cloned ? module-2
    $ Connect to ... ? Branch
    $ pull from ... ? main
    $ Starting to add a repo...
    $ Done...

This commands will clone the git repos within the **`my-project-workspace/modules`** folder.

example:

    my-project-workspace
     ├─ modules
     │   ├─ module-1
     │   │   └─ ...
     │   └─ module-2
     │       └─ ...
     └─ mws.json

If you prefer use a existing git repo, run the command **`mws init`**.
