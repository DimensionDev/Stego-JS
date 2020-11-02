#This is a script to test stegojs locally
mkdir -p /tmp/testStego
npm run build && curl "https://user-images.githubusercontent.com/3343358/82185006-201a9080-991b-11ea-8d0e-ab61b36ef1b9.png" > /tmp/testStego/input-test.png

str_size=128
test_size=100

########################################################
for alg in FFT1D FFT2D DCT
do
echo "Test "$alg

for i in $( eval echo {1..$test_size} )
do

str1=$(< /dev/urandom tr -dc ' (\n\&\_a-zA-X0-9\^\*\@' | head -c$str_size)
#cat /tmp/testStego/input-test.png | bin/stego.js -e --exhaustPixels false -f "$alg" -m "$str1" > output-test.png 2>/dev/null
cat /tmp/testStego/input-test.png | bin/stego.js -e -f "$alg" -m "$str1" --algorithmVersion "0.12.x" > /tmp/testStego/output-test.png 2>/dev/null

str2=$(cat /tmp/testStego/output-test.png | bin/stego.js -d -f "$alg" --algorithmVersion "0.12.x")

if [[ "$str1" != "$str2" ]]
then
    echo -e "fail".$str1
fi

v=$i/$test_size
echo -n "$v" $'\r'
done 

done

rm -rf tmp/testStego
