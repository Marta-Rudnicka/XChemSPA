#!/bin/bash
# This script uses podman instead of Docker because that's the RedHat version.
module load pollux # Diamonds Kubernetes deployment (will require logging in once a week)
# podman image prune -a
podman build --rm -t XChemSPA .
x=$(podman images | grep -e 'XChemSPA' | awk '{print $3}')
podman tag $x gcr.io/diamond-privreg/xchemapps/XChemSPA:latest
podman push gcr.io/diamond-privreg/xchemapps/XChemSPA:latest
echo 'Finished building Container'
