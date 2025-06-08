adduser presupplied
usermod -aG sudo presupplied
apt update
apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce
usermod -aG docker presupplied
mkdir /home/presupplied/.ssh
cp ~/.ssh/authorized_keys /home/presupplied/.ssh
chown -R presupplied:presupplied /home/presupplied/.ssh
