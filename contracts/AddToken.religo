type param = (string, string, address);
type token = { name: string, symbol: string, address: address, owner: address, createdOn: timestamp };

type storage = {
  tokensList: set (string),
  tokens: big_map (string, token),
};

let main = ((param,storage): (param, storage)) => {
  if(Tezos.amount > 0tez){
    failwith ("NoTokenAccepted"): (list(operation), storage);
  } else {
    // checks if token is not already in the list
    if(Set.mem(param[1], storage.tokensList)){
      failwith ("TokenAlreadyExists"): (list(operation), storage);
    } else {
      // creates new token
      let newToken: token = 
        { name: param[0], symbol: param[1], address: param[2], owner: Tezos.source, createdOn: Tezos.now };
      // adds token to tokens big map
      let newTokensMap = switch(Big_map.find_opt(param[1], storage.tokens)) {
        | Some (n) => failwith ("TokenAlreadyExists"): big_map (string, token)
        | None => Big_map.update(param[1], Some (newToken), storage.tokens)
      };
      // adds token to list
      let newTokensList = Set.add(param[1], storage.tokensList);
      // returns new storage
      ([]: list(operation), { tokensList: newTokensList, tokens: newTokensMap});
    }
  }
};