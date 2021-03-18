#!/bin/bash
module load pollux
x=$(kubectl get pods | grep -e 'XChemSPA' | awk '{print $1}')
kubectl delete pod $x
# Print new pods
kubectl get pods