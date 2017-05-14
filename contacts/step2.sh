#!/bin/bash
cd output
if [ ! -f line ]; then
  echo '' > line
  ls | xargs -I {} echo "cat {} line > t && mv t {}" | sh -v
fi
cd ../
zip bk.zip output/*.vcf
