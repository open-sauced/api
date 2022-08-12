<div align="center">
  <br>
  <img alt="Open Sauced" src="https://i.ibb.co/7jPXt0Z/logo1-92f1a87f.png" width="300px">
  <h1>🍕 Open Sauced Nest Supabase API🍕</h1>
  <strong>The path to your next Open Source contribution</strong>
</div>
<br>
<p align="center">
  <img src="https://img.shields.io/github/languages/code-size/open-sauced/api.opensauced.pizza" alt="GitHub code size in bytes">
  <img src="https://img.shields.io/github/commit-activity/w/open-sauced/api.opensauced.pizza" alt="GitHub commit activity">
  <a href="https://github.com/open-sauced/api.opensauced.pizza/issues">
    <img src="https://img.shields.io/github/issues/open-sauced/api.opensauced.pizza" alt="GitHub issues">
  </a>
  <a href="https://github.com/open-sauced/api.opensauced.pizza/releases">
    <img src="https://img.shields.io/github/v/release/open-sauced/api.opensauced.pizza.svg?style=flat" alt="GitHub Release">
  </a>
  <a href="https://discord.gg/U2peSNf23P">
    <img src="https://img.shields.io/discord/714698561081704529.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Discord">
  </a>
  <a href="https://twitter.com/saucedopen">
    <img src="https://img.shields.io/twitter/follow/saucedopen?label=Follow&style=social" alt="Twitter">
  </a>
</p>

## 🚀 Live release environments

- [api.opensauced.pizza](https://api.opensauced.pizza/docs)
- [beta.api.opensauced.pizza](https://beta.api.opensauced.pizza/docs)

## 📖 Prerequisites

In order to run the project we need the following software binaries installed on our development machines:
- `node>=16.7.0`
- `npm>=8.0.0`
- `docker>=20.10.12`
- `supabase>=0.18.0`

## 🔑 Database commands

### Starting the Supabase Studio

First thing we have to do for [local development](https://supabase.com/docs/guides/local-development) is start the studio locally at [localhost:54321](http://localhost:54321):

```shell
npm run db:start
```

### Make changes

If we are adding a new table structure, first do it visually in the Supabase Studio and test locally.

Check the migration difference with the following command:

```shell
npm run db:changes
```

If everything is fine we can run the following command to apply the changes to the database:

```shell
npm run db:commit add_table_name
```

### Test changes

Simplest way to test the migrations are working is to reset the local database:

```shell
npm run db:reset
```

### Push changes

If everything is fine we can push the changes to the remote database:

```shell
npm run db:push
```

# 🔑 Supabase structure

Click the image to see the schema diagram full documentation.

[![er](./supabase/diagrams/schema.svg)](./supabase/diagrams/README.md)

# 🤝 Contributing

We encourage you to contribute to Open Sauced! Please check out the [Contributing guide](https://docs.opensauced.pizza/contributing/introduction-to-contributing/) for guidelines about how to proceed.

<img align="right" src="https://i.ibb.co/CJfW18H/ship.gif" width="200"/>

## 🍕 Community

Got Questions? Join the conversation in our [Discord](https://discord.gg/U2peSNf23P).  
Find Open Sauced videos and release overviews on our [YouTube Channel](https://www.youtube.com/channel/UCklWxKrTti61ZCROE1e5-MQ).

## 🎦 Repository Visualization

[![Visualization of this repository](./public/diagram.svg)
](./src)

## ⚖️ LICENSE

MIT © [Open Sauced](LICENSE)
