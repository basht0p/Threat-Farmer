# ThreatFarmer

## Description
ThreatFarmer is a threat intelligence feed aggregator. You can configure feeds from source on the web in JSON, CSV, or TXT format to save their records to a database; then group (or silo) those records however you like to have a customizable API to enrich SIEM log data or just for investigation reference.

## Code Stack
ThreatFarmer's frontend is written in TypeScript, built on React.js. The backend API is also written in TypeScript, utilizing Express.js and Websockets for real-time data in the UI.

The backend API utilizes a MongoDB replica-set (single member) to store the data, feed, and silo configurations, as well as the feed download job history and configuration.

## Usage/Installation
### Prerequisites
- You must have a MongoDB instance running on the same machine as ThreatFarmer, with no authentication required. _Easily customizable env files to support auth and/or external servers is coming soon_
- The MongoDB instance must be a member of a replica set (even if it's the only member)
### Instructions
Copy the contents of **CurrentBuild** to some directory (I usually use /opt/threatfarmer/_contents go here_). Under the **server** directory within your root folder, either manually run **node server.js**, or use something like **pm2** to daemonize it
