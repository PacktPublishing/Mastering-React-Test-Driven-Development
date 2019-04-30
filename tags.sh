# Usage: regenerate-tags filename
#
# filename must be line-separated pairs of <tag>,<commit description>
#
# delete all existing tags
git tag | xargs -L 1 | xargs git push origin --delete
git tag | xargs -L 1 | xargs git tag --delete

# read each line from file
file=$1
while IFS=',' read -r tag description
do
  echo $tag
  git log --branches=* --grep="^$description$" --pretty=format:"%h" | xargs git tag "$tag"
done < "$file"

# push tags to remote
git push --tags
