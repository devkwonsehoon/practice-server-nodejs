const express = require("express");
const Goods = require("../schemas/Goods");
const Cart = require("../schemas/cart");

const router = express.Router();


// 상품
router.get("/goods", async (req, res, next) => {
  try {
    const { category } = req.query;
    const goods = await Goods.find({ category }).sort("-goodsId");
    res.json({ goods: goods });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  goods = await Goods.findOne({ goodsId: goodsId });
  res.json({ detail: goods });
});

router.post('/goods', async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  isExist = await Goods.find({ goodsId });
  if (isExist.length == 0) {
    await Goods.create({ goodsId, name, thumbnailUrl, category, price });
  }
  res.send({ result: "success" });
});


// 장바구니 담기
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  isCart = await Cart.find({ goodsId });
  console.log(isCart, quantity);
  if (isCart.length) {
    await Cart.updateOne({ goodsId }, { $set: { quantity } });
  } else {
    await Cart.create({ goodsId: goodsId, quantity: quantity });
  }
  res.send({ result: "success" });
});

// 장바구니 삭제
router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  
  const isGoodsInCart = await Cart.find({ goodsId });
  if (isGoodsInCart.length > 0) {
    await Cart.deleteOne({ goodsId });
  }

  res.send({
    result : "success"
  });
})

// 장바구니 내역 가져오기
router.get("/cart", async (req, res) => {
  const cart = await Cart.find({});
  const goodsId = cart.map(cart => cart.goodsId);

  goodsInCart = await Goods.find()
    .where("goodsId")
    .in(goodsId);

  concatCart = cart.map(c => {
    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].goodsId == c.goodsId) {
        return { quantity: c.quantity, goods: goodsInCart[i] };
      }
    }
  });

  res.json({
    cart: concatCart
  });
});

// 장바구니 수정
router.patch("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const isGoodsInCart = await Cart.find({goodsId});
  if (isGoodsInCart.length > 0) {
    await Cart.updateOne({ goodsId }, { $set : { quantity }});
  } 

  res.send({
    result : "success"
  })
})

module.exports = router;