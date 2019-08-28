@echo off

set /P "TAG=Tag deployment? "
if /I "%TAG%"=="" (
    goto DEV
)

call git tag %TAG%
call git push origin %TAG%

call firestore-export -a backups/firebase-auth.json -b backups/cookbook-99016-%TAG%.json

call firebase use cookbook-99016
call ng build --prod

goto DEPLOY

:DEV
call firebase use cookbook-test-e54e1
call ng build

:DEPLOY

call firebase deploy
