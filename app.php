<?php

// web/index.php
require_once __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\HttpFoundation\Request;
use Ramsey\Uuid\Uuid;


$db = Yaml::parse(file_get_contents(__DIR__ . '/data/shop.yaml'));
$cats = [];
$items = [];

foreach ($db['cats'] as $cat) {
  $cats[$cat['slug']] = $cat;
}

foreach ($db['items'] as $item) {
  $items[$item['slug']] = $item;
}

$app = new Silex\Application();

$app->register(new Silex\Provider\TwigServiceProvider(), array(
  'twig.path' => __DIR__ . '/views',
));
$app['twig']->addGlobal('tracker_domain', $_SERVER['DOMAIN']);

$app->register(new Silex\Provider\SessionServiceProvider());


$app->before(function (Request $request) use ($app, $items, $cats) {

  // JSON body
  if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
    $data = json_decode($request->getContent(), true);
    $request->request->replace(is_array($data) ? $data : array());
  }

  // user
  $user = $app['session']->get('user', array());
  $app['session']->set('user', $user);
  $app['twig']->addGlobal('user', $user);
  $app['twig']->addGlobal('host', $_SERVER['HTTP_HOST']);

  // cart
  $cart = $app['session']->get('cart', array());
  $app['session']->set('cart', $cart);
  $app['twig']->addGlobal('cart', $cart);

  // order
  $order = $app['session']->get('order', array());
  if(!isset($order['cartId'])){
    $order['cartId'] = Uuid::uuid4()->toString();
  }
  $app['session']->set('order', $order);

  $app['twig']->addGlobal('order', $order);

  // other

  $app['twig']->addGlobal('isDevServer', $_SERVER['HTTP_HOST'] == 'odl-shop.dev');
  $app['twig']->addGlobal('items', $items);
  $app['twig']->addGlobal('cats', $cats);
});

$app->get('/login', function () use ($app) {
  return $app['twig']->render('login.twig', array());
});

$app->post('/login', function (Request $request) use ($app) {
  $email = $request->get('email', null);

  $user = $app['session']->get('user', array());
  $user['email'] = $email;
  $user['id'] = md5($email);
  $app['session']->set('user', $user);
  return $app->redirect('/');
});

$app->get('/logout', function () use ($app) {
  $app['session']->remove('user');
  return $app->redirect('/');
});

$app->post('/subscribe', function (Request $request) use ($app) {
  $email = $request->get('email', null);
  return $app->redirect('/');
});


/**
 * Home and category pages
 */

$app->get('/', function () use ($app) {
  return $app['twig']->render('home.twig', array());
});

$app->get('/search', function (Request $request) use ($app, $items) {

  $query = $request->get('query', null);
  return $app['twig']->render('search.twig', array(
    'searchResults' => array_filter($items, function ($hz) use($query) {
      return !!strpos(strtolower($hz['name'].$hz['slug']), $query);
    })
  ));
});

$app->get('/category/{category}', function ($category) use ($app, $db, $cats) {
  return $app['twig']->render('category.twig', array(
    'db' => $db,
    'cat' => $cats[$category],
    'category' => $category,
    'subcategory' => null,
    'categories' => [$category]
  ));
});

$app->get('/category/{category}/{subcategory}', function ($category, $subcategory) use ($app, $db, $cats) {
  return $app['twig']->render('category.twig', array(
    'db' => $db,
    'cat' => $cats[$category],
    'category' => $category,
    'subcategory' => $subcategory,
    'categories' => [$category, $subcategory]
  ));
});

$app->get('/item/{slug}', function ($slug) use ($app, $db, $cats, $items) {

  $item = $items[$slug];
  $subcategorySlug = $item['category'][count($item['category']) - 1];
  $subcategory = $cats[$subcategorySlug];

  return $app['twig']->render('item.twig', array(
    'db' => $db,
    'subcategory' => $subcategory,
    'item' => $item,
  ));
});



/**
 * Корзина
 */


$app->get('/cart', function () use ($app, $items) {

  return $app['twig']->render('cart.twig', array(
    'items' => $items,
  ));
});

$app->post('/coupon', function (Request $request) use ($app) {
  $code = $request->get('code');
  $order = $app['session']->get('order');
  $order['coupon'] = $code;
  $app['session']->set('order', $order);

  return $app->json(['success' => true, 'code' => $code]);

});

$app->get('/debug', function (Request $request) use ($app) {

  $order = $app['session']->get('order');
  $cart = $app['session']->get('cart');

  print_r($order);
  print_r($cart);
  die();

});


$app->post('/cart', function (Request $request) use ($app) {

  $slug = $request->get('slug', false);

  if ($slug) {

    $quantity = $request->get('quantity', 1);
    $item = array(
      'slug' => $slug,
      'quantity' => $quantity,
      'size' => $request->get('size', false),
    );

    $cart = $app['session']->get('cart', array());

    if ($quantity > 0) {
      $cart[$item['slug']] = $item;
    } else {
      unset($cart[$item['slug']]);
    }

    $app['session']->set('cart', $cart);
  }

  return $app->json(['success' => true]);
});


/**
 * Content pages
 */

$app->get('/pages/{page}', function ($page) use ($app) {
  return $app['twig']->render("pages/${page}.twig", array());
});


/**
 * Checkout pages
 */

$app->get('/checkout', function () use ($app, $db) {

  $order = $app['session']->get('order');
  if(!isset($order['orderId'])){
    $order['orderId'] = Uuid::uuid4()->toString();
    $order['coupon'] = '';
  }
  $app['session']->set('order', $order);

  return $app['twig']->render('checkout/checkout-address.twig', array());
});

$app->get('/checkout-shipping', function () use ($app, $db) {
  return $app['twig']->render('checkout/checkout-shipping.twig', array());
});

$app->get('/checkout-payment', function () use ($app, $db) {
  return $app['twig']->render('checkout/checkout-payment.twig', array());
});

$app->get('/checkout-review', function () use ($app, $db) {
  return $app['twig']->render('checkout/checkout-review.twig', array());
});

$app->get('/receipt', function () use ($app, $items) {

  $sectionLayer = ['products' => []];
  $cart = $app['session']->get('cart');
  $subtotal = 0;
  $order = $app['session']->get('order');

  foreach ($cart as $line){
    $item = $items[$line['slug']];
    $sectionLayer['products'][] = [
      'id' => $item['slug'],
      'name' => $item['name'],
      'quantity' => $line['quantity'],
      'category' => $item['category'],
      'price' => $item['salePrice'] ?? $item['price']
    ];
    $subtotal += $item['salePrice'] ?? $item['price'];
  }

  $app['session']->remove('cart');
  $app['session']->remove('order');

  return $app['twig']->render('checkout/receipt.twig', array(
    'sectionLayer' => json_encode($sectionLayer),
    'subtotal' => $subtotal,
    'lastOrder' => $order
  ));
});
