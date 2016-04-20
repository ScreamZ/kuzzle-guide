## Install on Windows

### Using Docker

#### Prerequisites

* Install [Docker](https://docs.docker.com/engine/installation/windows/) properly and do not forget to restart the computer
* Note that Git for Windows™ will be installed too
* Note the machine name and machine IP when launching docker toolbox (you can retrieve the machine IP later by typing ```docker-machine ip <machine name>```)
* Note that, by default, the machine name is just ```default```

#### Step one

Clone the Kuzzle Git repo:

```bash
git clone https://github.com/kuzzleio/kuzzle.git
```

#### Step two

Go into the kuzzle directory and launch it:

```bash
cd kuzzle && docker-compose up
```

A bunch of logs should appear, and the last line should ends with 

```bash
log:info: == DB preparation done.
```

Then you can access ```http://<docker-machine IP>:7511/api/1.0``` in your browser and you should read 

```javascript
{
    "error": null,
    "result": "Hello from Kuzzle :)",
    "status": 200
}
```