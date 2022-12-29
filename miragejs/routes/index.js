/*
 * Mirage JS guide on Routes: https://miragejs.com/docs/route-handlers/functions
 */

// import { Response } from 'miragejs';

export default function routes() {
  this.namespace = 'api';
  // this.timing = 5000;

  /*
   * A resource comprises all operations for a CRUD
   * operation. .get(), .post(), .put() and delete().
   * Mirage JS guide on Resource: https://miragejs.com/docs/route-handlers/shorthands#resource-helper
   */
  this.resource('products');
  // this.get('products', () => {
  //   return new Response(500, {}, 'O server morreu!');
  // });
}