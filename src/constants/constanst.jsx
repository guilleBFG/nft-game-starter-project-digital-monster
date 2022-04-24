const CONTRACT_ADDRESS = '0x2dD0de2B975be064C3196eE1A8146D1fFdCe22A4';

const transformCharacterData = (characterData) =>{
  return{
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    evolutionStages: characterData.evolutionStages.toNumber(),
    maxEvolutionStages: characterData.maxEvolutionStages.toNumber(),
  }
}

const transformBossData = (characterData) =>{
  return{
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  }
}



export { CONTRACT_ADDRESS, transformCharacterData,transformBossData };