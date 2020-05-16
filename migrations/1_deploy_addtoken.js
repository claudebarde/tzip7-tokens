const AddToken = artifacts.require("AddToken");
const { MichelsonMap } = require("@taquito/taquito");

const initial_storage = {
  tokensList: [],
  tokens: new MichelsonMap(),
};

module.exports = (deployer) => {
  deployer.deploy(AddToken, initial_storage);
};
