/* eslint-disable */
const transactionCreateDtoInType = shape({
  text: uu5String().isRequired(),
  amount:  integer().isRequired()
});
const transactionListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const transactionDeleteDtoInType = shape({
  id: id().isRequired()
});
