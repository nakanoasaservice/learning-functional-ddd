import * as R from 'remeda';

// 5.3
type Brand<K, T> = K & { __brand: T };
type Result<S, F> =
  | {
      success: true;
      value: S;
    }
  | {
      success: false;
      error: F;
    };

type CustomerId =
  // | // 1つの要素のUnion型
  Brand<number, 'CustomerId'>;

// type CustomerId = Brand<string, 'CustomerId'>;

// type WidgetCode = Brand<string, 'WidgetCode'>;
type UnitQuantity = Brand<number, 'UnitQuantity'>;
type KilogramQuantity = Brand<number, 'KilogramQuantity'>;

const customerId = 42 as CustomerId;

type OrderId = Brand<number, 'OrderId'>;

const orderId = 42 as OrderId;

// @ts-expect-error -- TS2367
const cond = customerId === orderId;

const processCustomerId = (id: CustomerId) => {
  // C#と異なり、型のアップキャストは自動的に行われない

  // 明示的なアップキャストが必要
  const innerValue: number = id;
};

type ProcessCustomerId = (id: CustomerId) => void;

// @ts-expect-error -- TS2345
processCustomerId(orderId);

// アンラップ（TSではアップキャスト）
const innerValue: number = customerId;

// 5.3.3
// ここの内容はTSのBrand型で今までやってきたことと同じである
// 逆にパフォーマンスを気にしないのであれば、すべてにタグ付きユニオン型を使うこともできる

// 5.4
type CustomerInfo = undefined;
type ShippingAddress = undefined;
type BillingAddress = undefined;
type OrderLine = undefined;
type AmountToBill = undefined;
type Order = {
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  orderLines: OrderLine[];
  amountToBill: AmountToBill;
};

type WidgetCode = Brand<string, 'WidgetCode'>;
type GizmoCode = Brand<string, 'GizmoCode'>;
type ProductCode =
  | {
      type: 'Widget'; // タグ付きユニオンのタグをケースラベルとして扱う
      code: WidgetCode;
    }
  | {
      type: 'Gizmo'; // タグ付きユニオンのタグをケースラベルとして扱う
      code: GizmoCode;
    };

type OrderQuantity =
  | {
      type: 'Unit';
      quantity: UnitQuantity;
    }
  | {
      type: 'Kilogram';
      quantity: KilogramQuantity;
    };

// 5.5
type UnvalidatedOrder = undefined;
type ValidatedOrder = undefined;
type ValidateOrder = (i: UnvalidatedOrder) => ValidatedOrder;

// 5.5.1
// ワークフローの出力が2つ以上存在する場合
type AcknowledgementSent = undefined;
type OrderPlaced = undefined;
type BillableOrderPlaced = undefined;
type PlaceOrderEvents = {
  acknowledgementSent: AcknowledgementSent;
  orderPlaced: OrderPlaced;
  billableOrderPlaced: BillableOrderPlaced;
};

type PlaceOrder = (i: UnvalidatedOrder) => PlaceOrderEvents;

type EnvelopeContents = Brand<string, 'EnvelopeContents'>;
type QuoteForm = undefined;
type OrderForm = undefined;
type CategorizedMail =
  | {
      type: 'Quote';
      content: QuoteForm;
    }
  | {
      type: 'Order';
      content: OrderForm;
    };

// 入力が2つ以上存在する場合
// 方法1: 引数を増やす（以下はカリー化された関数）
type ProductCatalog = undefined;
type PricedOrder = undefined;
type CalculatePrices = (i: OrderForm) => (j: ProductCatalog) => PricedOrder;

// 方法2: 両方を含む新しい型を作成する
type CalculatePricesInput = {
  orderForm: OrderForm;
  productCatalog: ProductCatalog;
};
type CalculatePrices2 = (i: CalculatePricesInput) => PricedOrder;

// 5.5.2
// 副作用を型で表現するには、Promiseを使う
type ValidationError = undefined;
type ValidateOrder2 = (
  i: UnvalidatedOrder
) => Promise<Result<ValidatedOrder, ValidationError[]>>;

type ValidationResponse<T> = Promise<Result<T, ValidationError[]>>;

type ValidateOrder3 = (
  i: UnvalidatedOrder
) => ValidationResponse<ValidatedOrder>;

// 5.6
// 中身が同じなら同一とみなすものを値オブジェクトと呼ぶ
const widgetCode1 = 'W1234' as WidgetCode;
const widgetCode2 = 'W1234' as WidgetCode;
console.log(widgetCode1 === widgetCode2); // true

const name1 = { firstName: 'Alex', lastName: 'Adams' };
const name2 = { firstName: 'Alex', lastName: 'Adams' };

console.log(name1 === name2); // TSではfalse
console.log(R.isDeepEqual(name1, name2)); // ライブラリを使うとオブジェクトに対しても比較できる

const address1 = { city: 'London', street: '123 Fake Street' };
const address2 = { city: 'London', street: '123 Fake Street' };
console.log(R.isDeepEqual(address1, address2)); // true

// 5.7
// 識別子で同一とみなすものをエンティティと呼ぶ
type ContactId = Brand<number, 'ContactId'>;
type PhoneNumber = undefined;
type EmailAddress = undefined;
type Contact = {
  id: ContactId;
  phoneNumber: PhoneNumber;
  emailAddress: EmailAddress;
};

// 悪い例: IDを各ケースの外側に持たせる
type UnpaidInvoiceInfo = {};
type PaidInvoiceInfo = {};

type InvoiceInfo =
  | {
      type: 'Unpaid';
      info: UnpaidInvoiceInfo;
    }
  | {
      type: 'Paid';
      info: PaidInvoiceInfo;
    };

type InvoiceId = Brand<number, 'InvoiceId'>;

type Invoice = {
  id: InvoiceId;
  info: InvoiceInfo;
};

// 良い例: IDを各ケースの内側に持たせる
type UnpaidInvoiceInfo2 = { id: InvoiceId };
type PaidInvoiceInfo2 = { id: InvoiceId };
type Invoice2 =
  | {
      type: 'Unpaid';
      info: UnpaidInvoiceInfo2;
    }
  | {
      type: 'Paid';
      info: PaidInvoiceInfo2;
    };

let invoice: Invoice2;

import { match, P } from 'ts-pattern';

// パターンマッチの際にすべてのデータにアクセスできる！
// @ts-expect-error
match(invoice)
  .with({ type: 'Paid', info: { id: P.number } }, ({ info }) => {
    console.log(info.id);
  })
  .with({ type: 'Unpaid', info: { id: P.number } }, ({ info }) => {})
  .run();

// エンティティの同一性を定義するにはいくつかの方法がある
// 1. equalsメソッドを実装する

// 5.7.4
// TSでエンティティの不変性を保証するには、いくつか方法がある
// 1. プロパティをreadonlyにする
// 2. オブジェクトを凍結する（Object.freeze）
// 3. eslint/functionalを使う
// もしくは妥協して使わない

const updatePerson = person => ({ ...person, name: 'Joe' });

// 5.8
// エンティティがサブのエンティティを持つことはよくある
// サブエンティティを変更した場合、親エンティティも変更された扱いになる
// そしてエンティティは普遍であるため、親エンティティを含めたコピーを作成する必要がある。
// 親を持たないルートのエンティティを集約ルートと呼ぶ。

type OrderLineId = Brand<number, 'OrderLineId'>;
type Price = Brand<number, 'Price'>;
const changeOrderLinePrice = (
  order: Order,
  orderLineId: OrderLineId,
  newPrice: Price
) => {
  // @ts-ignore
  const orderLine = order.orderLines.find(ol => ol.id === orderLineId);

  // @ts-ignore
  const newOrderLine = { ...orderLine, price: newPrice };

  const newOrderLines = order.orderLines.map(ol =>
    // @ts-ignore
    ol.id === orderLineId ? newOrderLine : ol
  );

  const newOrder = { ...order, orderLines: newOrderLines };

  return newOrder;
};

// 5.9
// 悪い例: 顧客を変更したければ、すべてのOrderも変更しないといけない
type Customer = {
  id: CustomerId;
};
type Order2 = {
  orderId: OrderId;
  customer: Customer;
  orderLines: OrderLine[];
};

// 良い例: 顧客への参照を持つ
type Order3 = {
  orderId: OrderId;
  customerId: CustomerId;
  orderLines: OrderLine[];
};

namespace OrderTaking {
  // 型の定義

  // 製品コード関連
  type WidgetCode = Brand<string, 'WidgetCode'>; // 制約: 先頭がW＋数字4桁
  type GizmoCode = Brand<string, 'GizmoCode'>; // 制約: 先頭がG＋数字3桁

  type ProductCode =
    | {
        type: 'Widget';
        code: WidgetCode;
      }
    | {
        type: 'Gizmo';
        code: GizmoCode;
      };

  // 注文数量関連
  type UnitQuantity = Brand<number, 'UnitQuantity'>;
  type KilogramQuantity = Brand<number, 'KilogramQuantity'>;

  type OrderId = undefined;
  type OrderLineId = undefined;
  type CustomerId = undefined;

  type CustomerInfo = undefined;
  type ShippingAddress = undefined;
  type BillingAddress = undefined;
  type Price = undefined;
  type BillingAmount = undefined;

  type Order = {
    id: OrderId; // エンティティのID
    customerId: CustomerId; // 顧客の参照
    shippingAddress: ShippingAddress;
    billingAddress: BillingAddress;
    orderLines: OrderLine[];
    amountToBill: BillingAmount;
  };

  type OrderLine = {
    id: OrderLineId;
    orderId: OrderId;
    productCode: ProductCode;
    orderQuantity: OrderQuantity;
    price: Price;
  };

  // ワークフロー
  // ワークフローの入力はプリミティブな型しか含まれない
  type UnvalidatedOrder = {
    orderId: string;
    customerInfo: {};
    shippingAddress: {};
  };

  // ワークフローの出力
  type PlaceOrderEvents = {
    acknowledgementSent: {};
    orderPlaced: {};
    billableOrderPlaced: {};
  };

  type PlaceOrderError =
    | {
        type: 'ValidationError';
        errors: ValidationError[];
      }
    | { type: 'OtherError' };

  type ValidationError = {
    fieldName: string;
    errorDescription: string;
  };

  type PlaceOrder = (
    i: UnvalidatedOrder
  ) => Result<PlaceOrderEvents, PlaceOrderError>;
}
