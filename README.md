# Google Photos Restore
This is a personal project of mine to help keep me coding. While not everyone checking out this repo may find it useful, it helps me solve a very simple problem.


# Problem statement
 What problem am I trying to solve, exactly? Restoring my Google Photos library after exporting it using Takeout. I find that these exported packages (in the form of zip files) are not particularly enjoyable to work with.

## What makes the Takeouts archive unusable
 1. **What to do with all these zip files?** Since I have a particularly large Photos collection, this translates into quite a few large zip files, all of which contain a portion of my massive collection. What's worse, when I extract these files, they contain incomplete folders, making me believe that directories got partitioned across multiple zip files. This is simply usuable.
 1. **Wrong dates** In some (but not all) cases, the timestamp is clearly off, at least when viewing it in Mac Finder. Though this isn't a showstopper since all the photos are housed in folders named after the date, it's still a nuissance. I'd like files to reflect actual dates to avid any potential confusion. 
 1. **Junk files** Every image and video file comes with a corresponding JSON file. This file contains metatdata about the media, such as an accurate creation timestamp, geopositioning data, and a lot more. While this is generally useful information, it's already baked into the image file itself. So I'm considering this clutter, and I want to be archive all of them away somewhere out of sight. Probably don't want to delete them in case I find a use for them in the future.

 # Solution

Though this problem lends itself nicely to a low-stakes and rough MapReduce architecture, I want to start even simpler than that. I'll have a NodeJS app that is invoked via `curl` or PostMan

## Endpoints

1. `/api/healthcheck` to run a basic health check on the running app
2. `/api/fix` to fix the date for a single file, based on the metadata


 # Approach

# Release notes & version log
## Version 0.0.1
MVP: basic `/fix` endpoint 

## Version 0.0.0
The very first and basic iteration of this program needs to start with the bare-minimum MVP. I should have the project structure in place and be able to stand up a RESTful endpoint that simple logs the status. It should be a clean project that I can run from anywhere by following some clear, short steps.

# Running this app
1. Make sure **Typescript** and **NodeJS** are installed
1. Set up **environment variables**. The following variables **must** be added to a `.env` file in the project root directory. If this file doesn't exist, add it. Pay attention to the values and make sure all the specified paths exist.
```
PORT=Any number you like (e.g., 3000)
LOG_LEVEL=Desired log level (e.g,'debug')
ARCHIVE_ROOT=The parent folder that contains Takeout zip packages (e.g.,'/Volumes/External HDD Drive/Google Photos Takeout')
TEST_IMAGE_PATH=Path to a test image (e.g.,'/Users/user/test/PXL_20201106_172909201.jpg')
META_ARCHIVE_DIR=This is where the JSON metadata files will be placed and zipped (e.g., '/Volumes/External HDD/Google Photos Takeout/Junk')

```
3. First run:
```
npm install
```
4. Every run thereafter:
```
npm run start
```
5. This will spit out a healthcheck endpoing. Hit it with curl or PostMan to make sure the app came up properly, e.g.
```
curl -v http://localhost:3000/api/archive/healthcheck  | python -m json.tool
```