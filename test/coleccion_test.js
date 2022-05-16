const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Contrato NFT", function () {

    let Collection;
    let contract;
    let owner;
    let addresses;
    const _addressesWhitelist = [];
    const _addressesSendFullArt = [];
    const max_mint = 3;
    const uriNotRevealed = "http://notRevealed";
    const uriRevelado = "https://DirRevealed/"

    before(async function () {

        // Contract to test
        Collection = await ethers.getContractFactory("PartsCollection");

        // Getting signers
        addresses = await hre.ethers.getSigners();

        // Owner
        owner = addresses[0]
        console.log("Owner:", owner.address)
        // Whitelist: wallets 1 to 5
        for (let i = 1; i <= 5; i++) {
            _addressesWhitelist.push(addresses[i].address)
        }
        console.log("WhiteList Addresses:", _addressesWhitelist)

        // Deploy Collection
        contract = await Collection.deploy();
    })

    describe("Initial variables", function () {

        it("Must initialize variables correctly", async function () {

            expect(await contract._baseURIextended()).to.equal("")
            expect(await contract._baseURInotRevealed()).to.equal("")
            expect(await contract.MAX_SUPPLY()).to.equal(25)
            expect(await contract.MAX_PUBLIC_MINT()).to.equal(10)
            expect(await contract.PRICE_PER_TOKEN()).to.equal(100000000000000)
            expect(await contract.whitelistIsActive()).to.equal(false)
            expect(await contract.saleIsActive()).to.equal(false)
            expect(await contract.revealed()).to.equal(false)
            expect(await contract.tokenId()).to.equal(1)
            await expect(contract.mintWhitelist(1)).to.be.revertedWith("Whitelist is not active")
            await expect(contract.mint(1)).to.be.revertedWith("Sale is not active yet")
        })

    })

    describe("Whitelist", function () {
        it("Must fill whitelist", async function () {

            // Try to fill whitelist from a not owner address
            await expect(contract.connect(addresses[1]).setWhitelist(_addressesWhitelist, max_mint)).to.be.revertedWith("Ownable: caller is not the owner")

            // Try to fill it from owner address
            await contract.setWhitelist(_addressesWhitelist, max_mint)

            // Test that all addresses and their max_mint where push into the mapping
            for (const address of _addressesWhitelist) {
                expect(await contract._whiteList(address)).to.equals(max_mint)
            }
        })

        // Activate mint for whitelist
        it("Must initialize whitelist", async function () {
            await contract.setWhitelistActive()
            expect(await contract.whitelistIsActive()).to.equal(true)
        })
    })

    describe("BaseURI not Revealed", function () {
        it("Must set value to _baseURInotRevealed", async function () {

            // Set URI to non revealed
            await contract.setBaseUriNotRevealed(uriNotRevealed)
            expect(await contract._baseURInotRevealed()).to.equal(uriNotRevealed)

        })

    })

    describe("Mint Whitelist", function () {
        it("Whitelist must be able to mint", async function () {

            // Address is on whitelist but wants to mint more than its capability
            await expect(contract.connect(addresses[1]).mintWhitelist(4, { value: 400000000000000 })).to.be.revertedWith("Exceeded max available to purchase")
            // Address not in whitelist trying to mint
            await expect(contract.connect(addresses[7]).mintWhitelist(2, { value: 200000000000000 })).to.be.revertedWith("Exceeded max available to purchase")
            // Address on whitelist but sending less eth than required
            await expect(contract.connect(addresses[1]).mintWhitelist(3, { value: 200000000000000 })).to.be.revertedWith("Ether value is not correct")

            // First 3 whitelist addresses mint 3 nfts each
            for (let i = 1; i <= 3; i++) {
                await contract.connect(addresses[i]).mintWhitelist(3, { value: 300000000000000 })
                expect(await contract.balanceOf(addresses[i].address)).to.equal(3)
                expect(await contract.tokenId()).to.equal((i * 3 + 1))
            }

            console.log("TokenId:", await contract.tokenId())
            // Address which already minted all max_mint tries to mint an extra one
            await expect(contract.connect(addresses[1]).mintWhitelist(1, { value: 100000000000000 })).to.be.revertedWith("Exceeded max available to purchase")

        })

    })

    describe("TokenURI", function () {
        it("TokenURI value must be the notRevealed one", async function () {

            // Every token created must have notRevealed URI
            for (let i = 1; i <= 9; i++) {
                expect(await contract.tokenURI(i)).to.equal(uriNotRevealed)
            }

        })
    })

    describe("Public Sale", function () {
        it("Opens public minting", async function () {
            await contract.setSaleIsActive()
            expect(await contract.saleIsActive()).to.equal(true)

        })

        it("Any wallet could be able to mint", async function () {

            // Tries to mint more than max mint per wallet
            await expect(contract.connect(addresses[8]).mint(11, { value: 1100000000000000 })).to.be.revertedWith("Exceeded max available to purchase")
            // Address sending less eth than required
            await expect(contract.connect(addresses[8]).mint(3, { value: 200000000000000 })).to.be.revertedWith("Ether sent value is not correct")


            // Mint 1
            await contract.connect(addresses[10]).mint(1, { value: 100000000000000 })
            expect(await contract.balanceOf(addresses[10].address)).to.equal(1)
            //_direccionesGift.push(addresses[1].address)

            // TokenId
            tokenId = await contract.tokenId()
            console.log("TokenId:", tokenId)

            // 4 whitelist wallets mint 2 each
            for (let i = 1; i <= 3; i++) {
                await contract.connect(addresses[i]).mint(2, { value: 200000000000000 })
                expect(await contract.balanceOf(addresses[i].address)).to.equal(5)
                //_direccionesGift.push(addresses[2 + i].address)
            }

            // Mint the rest: 9/25
            await contract.connect(addresses[15]).mint(9, { value: 900000000000000 })
            expect(await contract.balanceOf(addresses[15].address)).to.equal(9 + 1) // +1 for the Full Art NFT

            // Already minted all 25 parts
            tokenId = await contract.tokenId()
            console.log("TokenId:", tokenId)

            // Another wallet tries to mint when no more supply
            await expect(contract.connect(addresses[12]).mint(1, { value: 100000000000000 })).to.be.revertedWith("Purchase will exceed max supply")

            // Check that every wallet received Full Art
            let wallets = [1, 2, 3, 10, 15]
            for (let i = 26; i < tokenId; i++) {
                // console.log(await contract.ownerOf(i))
                // console.log(addresses[wallets[i - 26]].address)
                expect(await contract.ownerOf(i)).to.equal(addresses[wallets[i - 26]].address)
            }

        })

        describe("NFT Reveal", function () {
            it("Reveal tokens and set new URI", async function () {

                // Revealed to true
                await contract.revealCollection()
                expect(await contract.revealed()).to.equal(true)

                await contract.setBaseUriExtended(uriRevelado)

                for (let i = 1; i <= 25; i++) {
                    expect(await contract.tokenURI(i)).to.equal(uriRevelado + i.toString())
                }

            })
        })

        describe("Withdraw", function () {
            it("Owner withdraws entire balance", async function () {

                const ownerBalanceActual = await waffle.provider.getBalance(owner.address)
                const contractBalance = await waffle.provider.getBalance(contract.address)

                console.log("Balance Owner:", ownerBalanceActual)
                console.log("Balance Contract:", contractBalance)

                tx = await contract.withdraw()
                const receipt = await tx.wait();
                const gasUsed = BigInt(receipt.cumulativeGasUsed) * BigInt(receipt.effectiveGasPrice);
                console.log("Used gas:", gasUsed)
                expect(await waffle.provider.getBalance(owner.address)).to.equal(ownerBalanceActual.toBigInt() - gasUsed + contractBalance.toBigInt())

            })

        });

    });
})