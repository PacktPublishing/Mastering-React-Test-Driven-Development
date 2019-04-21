# Mastering React Test-Driven Development
Published by Packt

This is companion repository for the book _Mastering React Test-Driven Development_ by Daniel Irvine, published by Packt.

The repository contains two branches, both of which are their own independent projects with their own READMEs. If you're interested in the contents of the books you can take a look at them now:

* [Appointments](https://github.com/PacktPublishing/Mastering-React-Test-Driven-Development/tree/appointments/appointments), a hair salon booking system
* [Spec Logo](https://github.com/PacktPublishing/Mastering-React-Test-Driven-Development/tree/spec-logo/spec-logo]), an online Logo environment for building Logo scripts

The book itself has checkpoints that are based on various tags. If you're following along then you'll need to be comfortable switching tags.

## Working along with the book

You should fork and then clone this repo to your local machine, and then check out a tag:

    git checkout tags/starting-point
  
You should then branch from this tag before continuing with changes:

    git checkout -b starting-point-mine
  
# Merging in changes from additional commits

Not all commits are covered in the book. They have been omitted because they are repetitive and teach nothing new. These occasions are clearly marked at the start of each section. You have two choices:

 * You can repeat the process above, starting a new branch and 'losing' all of your previous work in favor of the book's version. Of course, you'll still have the previous branch available that you were working on, it just won't join with your new branch.
 * You can merge in the commits that you were missing. This may not turn out to be straightforward if your code has deviated significantly from the book's code.
 
You can compare the difference between your current HEAD and the listed tag with `git diff`:

    git diff load-available-time-slots

You can then manually apply those changes.

If you'd rather try to automate those changes, then you can use git merge:

    git merge load-available-time-slots
 
 ## Get in touch
  
You can contact the author directly by raising Issues here in GitHub, or by contacting him on Twitter. He is [@d_ir](https://twitter.com/d_ir).
