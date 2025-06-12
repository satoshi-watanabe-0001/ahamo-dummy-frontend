import * as yup from 'yup';

const kanjiRegex = /[\u4e00-\u9faf]/;
const kanaRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
const postalCodeRegex = /^\d{3}-\d{4}$/;
const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;

export const personalInfoSchema = yup.object({
  nameKanji: yup.string()
    .required('漢字氏名は必須です')
    .test('has-kanji', '漢字を含む必要があります', value => kanjiRegex.test(value || '')),
  nameKana: yup.string()
    .required('カナ氏名は必須です')
    .test('has-kana', 'ひらがな・カタカナを使用してください', value => kanaRegex.test(value || '')),
  birthDate: yup.date()
    .required('生年月日は必須です')
    .max(new Date(), '未来の日付は選択できません'),
  gender: yup.string()
    .required('性別は必須です')
    .oneOf(['male', 'female', 'other'], '有効な性別を選択してください'),
  postalCode: yup.string()
    .required('郵便番号は必須です')
    .matches(postalCodeRegex, '郵便番号は000-0000の形式で入力してください'),
  prefecture: yup.string().required('都道府県は必須です'),
  city: yup.string().required('市区町村は必須です'),
  addressLine1: yup.string().required('住所は必須です'),
  addressLine2: yup.string(),
  building: yup.string(),
  phone: yup.string()
    .required('電話番号は必須です')
    .matches(phoneRegex, '電話番号は000-0000-0000の形式で入力してください'),
  email: yup.string()
    .required('メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
});

export type PersonalInfoFormData = yup.InferType<typeof personalInfoSchema>;
