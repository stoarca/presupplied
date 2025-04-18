# What is presupplied?

presupplied.com is a digital curriculum for children ages 0-18. Our goal is to
dramatically drive down the cost of great schooling.

Our curriculum differs from others as follows:

1. **The entire curriculum is free and open source.**
2. **It is comprehensive.** Where other education software covers only specific
    subjects or grades, our goal is to cover everything from potty training to
    calculus - anything that might be valuable to a child growing up.
    Perfect execution on our part would mean that a child missing one
    or both parents can still get an exceptional education.
3. **We teach the teacher.** We provide plenty of resources to aid the teacher.
    The teacher's role becomes that of role model and motivator rather than
    lecturer.
4. **We start at birth.** Perfect for first-time parents.
5. **Our curriculum is designed for both in-class and homeschooling.** We aim
    for the curriculum to follow the child no matter where they learn.
6. **Our curriculum is prerequisite-based rather than age-based.** Children
    can learn much faster than we give them credit for. Children can progress
    as quickly as they are able.

Most of the curriculum can be completed on a [$49 android tablet]. There are
some modules on writing (by hand) and typing that cannot be completed on
a tablet.
The entire curriculum can be completed on a [$269 2-in-1 laptop with stylus].

[$49 android tablet]: https://www.amazon.com/Android-Quad-Core-Processor-1280x800-Bluetooth/dp/B0CRL17YGJ
[$269 2-in-1 laptop with stylus]: https://www.amazon.com/Lenovo-Chromebook-Graphics-Chrome-Almond/dp/B08L5WZW76

# Setting up a development environment

The development environment aims to be deployed as similarly as possible to
the production environment.

First, clone the repository:

```
git clone https://github.com/stoarca/presupplied.git
cd presupplied
```

Then, generate some self-signed certs to enable https:

```
cd images/psingress/certs && ./generate-certs.sh
```

You will need to install the certs to your system certificate store and
in your browser:

```
sudo cp presupplied-selfsigned.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

You will need to upload the generated certificate as a certificate authority
in your browser. In chrome, go to about:settings/certificates and upload it
under the Authorities tab.

Next, add the following line to your `/etc/hosts` file

```
127.0.0.1 applocal.presupplied.com
```

Run the startup script. This will use docker compose to bring up a
bunch of containers. We run on ports 80 and 443 by default.
If you don't like this, you can edit the port configuration in
`docker-compose.yml.js`

```
./run.sh
```
