import React, { useRef, useCallback } from 'react'
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import api from '../../services/api'

import getValidadtionsErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
} from "./styles";

interface SignUpFormData {
  name: string
  email: string
  passowrd: string
}


const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const nameInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatírio.'),
          email: Yup.string()
            .required('E-mail obrigatorio.')
            .email('Digite um e-mail valido.'),
          password: Yup.string().min(6, 'No minimo 6 digitos.')
        })

        await schema.validate(data, {
          abortEarly: false //retorna todos os erros de uma vez só
        })

        await api.post('/users', data)

        Alert.alert(
          'Cadastro realizado!',
          'Você já pode fazer seu logon no GoBarber!',
        )

        navigation.goBack()

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidadtionsErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Erro no cadastro.',
          'Ocorreu um erro ao fazer cadastro, tente novamente.',
        )
      }
    }, [navigation])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container >
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  nameInputRef.current?.focus()
                }}
              />

              <Input
                ref={nameInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button
                onPress={() => formRef.current?.submitForm()}>Entrar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <BackToSignInText>
          <Icon name="arrow-left" size={20} color="#fff" /> Voltar para o logon.
        </BackToSignInText>
      </BackToSignIn>

    </>
  )
}

export default SignUp
