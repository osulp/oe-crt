https://help.github.com/articles/syncing-a-fork/


Collaborating on projects using pull requests / Syncing a fork
Syncing a fork

Sync a fork of a repository to keep it up-to-date with the upstream repository.

Tip: Before you can sync your fork with an upstream repository, you must configure a remote that points to the upstream repository in Git.

    Open Terminal (for Mac and Linux users) or the command prompt (for Windows users).

    Change the current working directory to your local project.

    Fetch the branches and their respective commits from the upstream repository. Commits to master will be stored in a local branch, upstream/master.

    git fetch upstream
    remote: Counting objects: 75, done.
    remote: Compressing objects: 100% (53/53), done.
    remote: Total 62 (delta 27), reused 44 (delta 9)
    Unpacking objects: 100% (62/62), done.
    From https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY
     * [new branch]      master     -> upstream/master

    Check out your fork's local master branch.

    git checkout master
    Switched to branch 'master'

    Merge the changes from upstream/master into your local master branch. This brings your fork's master branch into sync with the upstream repository, without losing your local changes.

    git merge upstream/master
    Updating a422352..5fdff0f
    Fast-forward
     README                    |    9 -------
     README.md                 |    7 ++++++
     2 files changed, 7 insertions(+), 9 deletions(-)
     delete mode 100644 README
     create mode 100644 README.md

    If your local branch didn't have any unique commits, Git will instead perform a "fast-forward":

    git merge upstream/master
    Updating 34e91da..16c56ad
    Fast-forward
     README.md                 |    5 +++--
     1 file changed, 3 insertions(+), 2 deletions(-)

Tip: Syncing your fork only updates your local copy of the repository. To update your fork on GitHub, you must push your changes.
