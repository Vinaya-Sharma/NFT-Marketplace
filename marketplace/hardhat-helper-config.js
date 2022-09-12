const config = {
  31337: {
    keyHash:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGasLimit: 2500000,
  },
  4: {
    vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    subscriptionId: "21405",
    keyHash:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGasLimit: 2500000,
  },
};

const developmentChains = [31337];

module.exports = {
  config,
  developmentChains,
};
