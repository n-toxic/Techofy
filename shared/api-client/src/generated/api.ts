import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  AddPortBody,
  AddServerPoolBody,
  AdjustWalletBody,
  AdminInstance,
  AdminStats,
  AdminUser,
  AssignInstanceBody,
  AuthResponse,
  CreateTicketBody,
  DashboardSummary,
  DeployInstanceBody,
  DepositBody,
  DepositOrder,
  ErrorResponse,
  HealthStatus,
  Instance,
  InstanceCredentials,
  InstanceDetail,
  LoginBody,
  MessageResponse,
  Plan,
  PortRule,
  RegisterBody,
  ReplyTicketBody,
  RequestOtpBody,
  ServerPoolEntry,
  SupportTicket,
  SupportTicketDetail,
  Transaction,
  UpdateProfileBody,
  User,
  VerifyDepositBody,
  VerifyOtpBody,
  WalletInfo
} from './api.schemas.js';

import { customFetch } from '../custom-fetch.js';
import type { ErrorType , BodyType } from '../custom-fetch.js';

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getHealthCheckUrl = () => {




  return `/api/healthz`
}

/**
 * @summary Health check
 */
export const healthCheck = async ( options?: RequestInit): Promise<HealthStatus> => {

  return customFetch<HealthStatus>(getHealthCheckUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getHealthCheckQueryKey = () => {
    return [
    `/api/healthz`
    ] as const;
    }


export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthCheckQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>
export type HealthCheckQueryError = ErrorType<unknown>


/**
 * @summary Health check
 */

export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getHealthCheckQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRegisterUrl = () => {




  return `/api/auth/register`
}

/**
 * @summary Register a new user
 */
export const register = async (registerBody: RegisterBody, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getRegisterUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      registerBody,)
  }
);}




export const getRegisterMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<RegisterBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<RegisterBody>}, TContext> => {

const mutationKey = ['register'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof register>>, {data: BodyType<RegisterBody>}> = (props) => {
          const {data} = props ?? {};

          return  register(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>
    export type RegisterMutationBody = BodyType<RegisterBody>
    export type RegisterMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Register a new user
 */
export const useRegister = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<RegisterBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof register>>,
        TError,
        {data: BodyType<RegisterBody>},
        TContext
      > => {
      return useMutation(getRegisterMutationOptions(options));
    }

export const getVerifyOtpUrl = () => {




  return `/api/auth/verify-otp`
}

/**
 * @summary Verify OTP and complete registration
 */
export const verifyOtp = async (verifyOtpBody: VerifyOtpBody, options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getVerifyOtpUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      verifyOtpBody,)
  }
);}




export const getVerifyOtpMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError,{data: BodyType<VerifyOtpBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError,{data: BodyType<VerifyOtpBody>}, TContext> => {

const mutationKey = ['verifyOtp'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof verifyOtp>>, {data: BodyType<VerifyOtpBody>}> = (props) => {
          const {data} = props ?? {};

          return  verifyOtp(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type VerifyOtpMutationResult = NonNullable<Awaited<ReturnType<typeof verifyOtp>>>
    export type VerifyOtpMutationBody = BodyType<VerifyOtpBody>
    export type VerifyOtpMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Verify OTP and complete registration
 */
export const useVerifyOtp = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError,{data: BodyType<VerifyOtpBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof verifyOtp>>,
        TError,
        {data: BodyType<VerifyOtpBody>},
        TContext
      > => {
      return useMutation(getVerifyOtpMutationOptions(options));
    }

export const getLoginUrl = () => {




  return `/api/auth/login`
}

/**
 * @summary Login with email and password
 */
export const login = async (loginBody: LoginBody, options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      loginBody,)
  }
);}




export const getLoginMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<LoginBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<LoginBody>}, TContext> => {

const mutationKey = ['login'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof login>>, {data: BodyType<LoginBody>}> = (props) => {
          const {data} = props ?? {};

          return  login(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>
    export type LoginMutationBody = BodyType<LoginBody>
    export type LoginMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Login with email and password
 */
export const useLogin = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<LoginBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof login>>,
        TError,
        {data: BodyType<LoginBody>},
        TContext
      > => {
      return useMutation(getLoginMutationOptions(options));
    }

export const getRequestOtpUrl = () => {




  return `/api/auth/request-otp`
}

/**
 * @summary Request a login OTP
 */
export const requestOtp = async (requestOtpBody: RequestOtpBody, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getRequestOtpUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      requestOtpBody,)
  }
);}




export const getRequestOtpMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof requestOtp>>, TError,{data: BodyType<RequestOtpBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof requestOtp>>, TError,{data: BodyType<RequestOtpBody>}, TContext> => {

const mutationKey = ['requestOtp'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof requestOtp>>, {data: BodyType<RequestOtpBody>}> = (props) => {
          const {data} = props ?? {};

          return  requestOtp(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RequestOtpMutationResult = NonNullable<Awaited<ReturnType<typeof requestOtp>>>
    export type RequestOtpMutationBody = BodyType<RequestOtpBody>
    export type RequestOtpMutationError = ErrorType<unknown>

    /**
 * @summary Request a login OTP
 */
export const useRequestOtp = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof requestOtp>>, TError,{data: BodyType<RequestOtpBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof requestOtp>>,
        TError,
        {data: BodyType<RequestOtpBody>},
        TContext
      > => {
      return useMutation(getRequestOtpMutationOptions(options));
    }

export const getLogoutUrl = () => {




  return `/api/auth/logout`
}

/**
 * @summary Logout current session
 */
export const logout = async ( options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getLogoutUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getLogoutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext> => {

const mutationKey = ['logout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof logout>>, void> = () => {


          return  logout(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>

    export type LogoutMutationError = ErrorType<unknown>

    /**
 * @summary Logout current session
 */
export const useLogout = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof logout>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getLogoutMutationOptions(options));
    }

export const getGetMeUrl = () => {




  return `/api/auth/me`
}

/**
 * @summary Get current user
 */
export const getMe = async ( options?: RequestInit): Promise<User> => {

  return customFetch<User>(getGetMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getGetMeQueryOptions = <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMe>>> = ({ signal }) => getMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & { queryKey: QueryKey }
}

export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>
export type GetMeQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get current user
 */

export function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetMeQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getGetWalletUrl = () => {




  return `/api/users/wallet`
}

/**
 * @summary Get wallet balance
 */
export const getWallet = async ( options?: RequestInit): Promise<WalletInfo> => {

  return customFetch<WalletInfo>(getGetWalletUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetWalletQueryKey = () => {
    return [
    `/api/users/wallet`
    ] as const;
    }


export const getGetWalletQueryOptions = <TData = Awaited<ReturnType<typeof getWallet>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getWallet>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetWalletQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getWallet>>> = ({ signal }) => getWallet({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getWallet>>, TError, TData> & { queryKey: QueryKey }
}

export type GetWalletQueryResult = NonNullable<Awaited<ReturnType<typeof getWallet>>>
export type GetWalletQueryError = ErrorType<unknown>


/**
 * @summary Get wallet balance
 */

export function useGetWallet<TData = Awaited<ReturnType<typeof getWallet>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getWallet>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetWalletQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCreateDepositUrl = () => {




  return `/api/users/deposit`
}

/**
 * @summary Create a Razorpay deposit order
 */
export const createDeposit = async (depositBody: DepositBody, options?: RequestInit): Promise<DepositOrder> => {

  return customFetch<DepositOrder>(getCreateDepositUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      depositBody,)
  }
);}




export const getCreateDepositMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createDeposit>>, TError,{data: BodyType<DepositBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createDeposit>>, TError,{data: BodyType<DepositBody>}, TContext> => {

const mutationKey = ['createDeposit'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createDeposit>>, {data: BodyType<DepositBody>}> = (props) => {
          const {data} = props ?? {};

          return  createDeposit(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateDepositMutationResult = NonNullable<Awaited<ReturnType<typeof createDeposit>>>
    export type CreateDepositMutationBody = BodyType<DepositBody>
    export type CreateDepositMutationError = ErrorType<unknown>

    /**
 * @summary Create a Razorpay deposit order
 */
export const useCreateDeposit = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createDeposit>>, TError,{data: BodyType<DepositBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createDeposit>>,
        TError,
        {data: BodyType<DepositBody>},
        TContext
      > => {
      return useMutation(getCreateDepositMutationOptions(options));
    }

export const getVerifyDepositUrl = () => {




  return `/api/users/deposit/verify`
}

/**
 * @summary Verify Razorpay payment and credit wallet
 */
export const verifyDeposit = async (verifyDepositBody: VerifyDepositBody, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getVerifyDepositUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      verifyDepositBody,)
  }
);}




export const getVerifyDepositMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof verifyDeposit>>, TError,{data: BodyType<VerifyDepositBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof verifyDeposit>>, TError,{data: BodyType<VerifyDepositBody>}, TContext> => {

const mutationKey = ['verifyDeposit'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof verifyDeposit>>, {data: BodyType<VerifyDepositBody>}> = (props) => {
          const {data} = props ?? {};

          return  verifyDeposit(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type VerifyDepositMutationResult = NonNullable<Awaited<ReturnType<typeof verifyDeposit>>>
    export type VerifyDepositMutationBody = BodyType<VerifyDepositBody>
    export type VerifyDepositMutationError = ErrorType<unknown>

    /**
 * @summary Verify Razorpay payment and credit wallet
 */
export const useVerifyDeposit = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof verifyDeposit>>, TError,{data: BodyType<VerifyDepositBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof verifyDeposit>>,
        TError,
        {data: BodyType<VerifyDepositBody>},
        TContext
      > => {
      return useMutation(getVerifyDepositMutationOptions(options));
    }

export const getUpdateProfileUrl = () => {




  return `/api/users/profile`
}

/**
 * @summary Update user profile
 */
export const updateProfile = async (updateProfileBody: UpdateProfileBody, options?: RequestInit): Promise<User> => {

  return customFetch<User>(getUpdateProfileUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      updateProfileBody,)
  }
);}




export const getUpdateProfileMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError,{data: BodyType<UpdateProfileBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError,{data: BodyType<UpdateProfileBody>}, TContext> => {

const mutationKey = ['updateProfile'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateProfile>>, {data: BodyType<UpdateProfileBody>}> = (props) => {
          const {data} = props ?? {};

          return  updateProfile(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateProfile>>>
    export type UpdateProfileMutationBody = BodyType<UpdateProfileBody>
    export type UpdateProfileMutationError = ErrorType<unknown>

    /**
 * @summary Update user profile
 */
export const useUpdateProfile = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError,{data: BodyType<UpdateProfileBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof updateProfile>>,
        TError,
        {data: BodyType<UpdateProfileBody>},
        TContext
      > => {
      return useMutation(getUpdateProfileMutationOptions(options));
    }

export const getListInstancesUrl = () => {




  return `/api/instances`
}

/**
 * @summary List user's server instances
 */
export const listInstances = async ( options?: RequestInit): Promise<Instance[]> => {

  return customFetch<Instance[]>(getListInstancesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListInstancesQueryKey = () => {
    return [
    `/api/instances`
    ] as const;
    }


export const getListInstancesQueryOptions = <TData = Awaited<ReturnType<typeof listInstances>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listInstances>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListInstancesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listInstances>>> = ({ signal }) => listInstances({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listInstances>>, TError, TData> & { queryKey: QueryKey }
}

export type ListInstancesQueryResult = NonNullable<Awaited<ReturnType<typeof listInstances>>>
export type ListInstancesQueryError = ErrorType<unknown>


/**
 * @summary List user's server instances
 */

export function useListInstances<TData = Awaited<ReturnType<typeof listInstances>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listInstances>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListInstancesQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getDeployInstanceUrl = () => {




  return `/api/instances`
}

/**
 * @summary Deploy a new server instance
 */
export const deployInstance = async (deployInstanceBody: DeployInstanceBody, options?: RequestInit): Promise<Instance> => {

  return customFetch<Instance>(getDeployInstanceUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      deployInstanceBody,)
  }
);}




export const getDeployInstanceMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deployInstance>>, TError,{data: BodyType<DeployInstanceBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deployInstance>>, TError,{data: BodyType<DeployInstanceBody>}, TContext> => {

const mutationKey = ['deployInstance'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deployInstance>>, {data: BodyType<DeployInstanceBody>}> = (props) => {
          const {data} = props ?? {};

          return  deployInstance(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeployInstanceMutationResult = NonNullable<Awaited<ReturnType<typeof deployInstance>>>
    export type DeployInstanceMutationBody = BodyType<DeployInstanceBody>
    export type DeployInstanceMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Deploy a new server instance
 */
export const useDeployInstance = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deployInstance>>, TError,{data: BodyType<DeployInstanceBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof deployInstance>>,
        TError,
        {data: BodyType<DeployInstanceBody>},
        TContext
      > => {
      return useMutation(getDeployInstanceMutationOptions(options));
    }

export const getGetInstanceUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}`
}

/**
 * @summary Get instance details
 */
export const getInstance = async (instanceId: string, options?: RequestInit): Promise<InstanceDetail> => {

  return customFetch<InstanceDetail>(getGetInstanceUrl(instanceId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetInstanceQueryKey = (instanceId: string,) => {
    return [
    `/api/instances/${instanceId}`
    ] as const;
    }


export const getGetInstanceQueryOptions = <TData = Awaited<ReturnType<typeof getInstance>>, TError = ErrorType<unknown>>(instanceId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getInstance>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetInstanceQueryKey(instanceId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getInstance>>> = ({ signal }) => getInstance(instanceId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(instanceId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getInstance>>, TError, TData> & { queryKey: QueryKey }
}

export type GetInstanceQueryResult = NonNullable<Awaited<ReturnType<typeof getInstance>>>
export type GetInstanceQueryError = ErrorType<unknown>


/**
 * @summary Get instance details
 */

export function useGetInstance<TData = Awaited<ReturnType<typeof getInstance>>, TError = ErrorType<unknown>>(
 instanceId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getInstance>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetInstanceQueryOptions(instanceId,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getStartInstanceUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}/start`
}

/**
 * @summary Start an instance
 */
export const startInstance = async (instanceId: string, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getStartInstanceUrl(instanceId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getStartInstanceMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof startInstance>>, TError,{instanceId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof startInstance>>, TError,{instanceId: string}, TContext> => {

const mutationKey = ['startInstance'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof startInstance>>, {instanceId: string}> = (props) => {
          const {instanceId} = props ?? {};

          return  startInstance(instanceId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type StartInstanceMutationResult = NonNullable<Awaited<ReturnType<typeof startInstance>>>

    export type StartInstanceMutationError = ErrorType<unknown>

    /**
 * @summary Start an instance
 */
export const useStartInstance = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof startInstance>>, TError,{instanceId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof startInstance>>,
        TError,
        {instanceId: string},
        TContext
      > => {
      return useMutation(getStartInstanceMutationOptions(options));
    }

export const getStopInstanceUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}/stop`
}

/**
 * @summary Stop an instance
 */
export const stopInstance = async (instanceId: string, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getStopInstanceUrl(instanceId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getStopInstanceMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof stopInstance>>, TError,{instanceId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof stopInstance>>, TError,{instanceId: string}, TContext> => {

const mutationKey = ['stopInstance'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof stopInstance>>, {instanceId: string}> = (props) => {
          const {instanceId} = props ?? {};

          return  stopInstance(instanceId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type StopInstanceMutationResult = NonNullable<Awaited<ReturnType<typeof stopInstance>>>

    export type StopInstanceMutationError = ErrorType<unknown>

    /**
 * @summary Stop an instance
 */
export const useStopInstance = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof stopInstance>>, TError,{instanceId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof stopInstance>>,
        TError,
        {instanceId: string},
        TContext
      > => {
      return useMutation(getStopInstanceMutationOptions(options));
    }

export const getRebootInstanceUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}/reboot`
}

/**
 * @summary Reboot an instance
 */
export const rebootInstance = async (instanceId: string, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getRebootInstanceUrl(instanceId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getRebootInstanceMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof rebootInstance>>, TError,{instanceId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof rebootInstance>>, TError,{instanceId: string}, TContext> => {

const mutationKey = ['rebootInstance'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof rebootInstance>>, {instanceId: string}> = (props) => {
          const {instanceId} = props ?? {};

          return  rebootInstance(instanceId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RebootInstanceMutationResult = NonNullable<Awaited<ReturnType<typeof rebootInstance>>>

    export type RebootInstanceMutationError = ErrorType<unknown>

    /**
 * @summary Reboot an instance
 */
export const useRebootInstance = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof rebootInstance>>, TError,{instanceId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof rebootInstance>>,
        TError,
        {instanceId: string},
        TContext
      > => {
      return useMutation(getRebootInstanceMutationOptions(options));
    }

export const getGetInstanceCredentialsUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}/credentials`
}

/**
 * @summary Get instance credentials (IP, username, password)
 */
export const getInstanceCredentials = async (instanceId: string, options?: RequestInit): Promise<InstanceCredentials> => {

  return customFetch<InstanceCredentials>(getGetInstanceCredentialsUrl(instanceId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetInstanceCredentialsQueryKey = (instanceId: string,) => {
    return [
    `/api/instances/${instanceId}/credentials`
    ] as const;
    }


export const getGetInstanceCredentialsQueryOptions = <TData = Awaited<ReturnType<typeof getInstanceCredentials>>, TError = ErrorType<unknown>>(instanceId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getInstanceCredentials>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetInstanceCredentialsQueryKey(instanceId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getInstanceCredentials>>> = ({ signal }) => getInstanceCredentials(instanceId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(instanceId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getInstanceCredentials>>, TError, TData> & { queryKey: QueryKey }
}

export type GetInstanceCredentialsQueryResult = NonNullable<Awaited<ReturnType<typeof getInstanceCredentials>>>
export type GetInstanceCredentialsQueryError = ErrorType<unknown>


/**
 * @summary Get instance credentials (IP, username, password)
 */

export function useGetInstanceCredentials<TData = Awaited<ReturnType<typeof getInstanceCredentials>>, TError = ErrorType<unknown>>(
 instanceId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getInstanceCredentials>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetInstanceCredentialsQueryOptions(instanceId,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getListInstancePortsUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}/ports`
}

/**
 * @summary List open ports for an instance
 */
export const listInstancePorts = async (instanceId: string, options?: RequestInit): Promise<PortRule[]> => {

  return customFetch<PortRule[]>(getListInstancePortsUrl(instanceId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListInstancePortsQueryKey = (instanceId: string,) => {
    return [
    `/api/instances/${instanceId}/ports`
    ] as const;
    }


export const getListInstancePortsQueryOptions = <TData = Awaited<ReturnType<typeof listInstancePorts>>, TError = ErrorType<unknown>>(instanceId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listInstancePorts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListInstancePortsQueryKey(instanceId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listInstancePorts>>> = ({ signal }) => listInstancePorts(instanceId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(instanceId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listInstancePorts>>, TError, TData> & { queryKey: QueryKey }
}

export type ListInstancePortsQueryResult = NonNullable<Awaited<ReturnType<typeof listInstancePorts>>>
export type ListInstancePortsQueryError = ErrorType<unknown>


/**
 * @summary List open ports for an instance
 */

export function useListInstancePorts<TData = Awaited<ReturnType<typeof listInstancePorts>>, TError = ErrorType<unknown>>(
 instanceId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listInstancePorts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListInstancePortsQueryOptions(instanceId,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAddInstancePortUrl = (instanceId: string,) => {




  return `/api/instances/${instanceId}/ports`
}

/**
 * @summary Add a port rule to an instance
 */
export const addInstancePort = async (instanceId: string,
    addPortBody: AddPortBody, options?: RequestInit): Promise<PortRule> => {

  return customFetch<PortRule>(getAddInstancePortUrl(instanceId),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      addPortBody,)
  }
);}




export const getAddInstancePortMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addInstancePort>>, TError,{instanceId: string;data: BodyType<AddPortBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addInstancePort>>, TError,{instanceId: string;data: BodyType<AddPortBody>}, TContext> => {

const mutationKey = ['addInstancePort'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addInstancePort>>, {instanceId: string;data: BodyType<AddPortBody>}> = (props) => {
          const {instanceId,data} = props ?? {};

          return  addInstancePort(instanceId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddInstancePortMutationResult = NonNullable<Awaited<ReturnType<typeof addInstancePort>>>
    export type AddInstancePortMutationBody = BodyType<AddPortBody>
    export type AddInstancePortMutationError = ErrorType<unknown>

    /**
 * @summary Add a port rule to an instance
 */
export const useAddInstancePort = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addInstancePort>>, TError,{instanceId: string;data: BodyType<AddPortBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof addInstancePort>>,
        TError,
        {instanceId: string;data: BodyType<AddPortBody>},
        TContext
      > => {
      return useMutation(getAddInstancePortMutationOptions(options));
    }

export const getDeleteInstancePortUrl = (instanceId: string,
    portId: string,) => {




  return `/api/instances/${instanceId}/ports/${portId}`
}

/**
 * @summary Remove a port rule
 */
export const deleteInstancePort = async (instanceId: string,
    portId: string, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getDeleteInstancePortUrl(instanceId,portId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getDeleteInstancePortMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteInstancePort>>, TError,{instanceId: string;portId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteInstancePort>>, TError,{instanceId: string;portId: string}, TContext> => {

const mutationKey = ['deleteInstancePort'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteInstancePort>>, {instanceId: string;portId: string}> = (props) => {
          const {instanceId,portId} = props ?? {};

          return  deleteInstancePort(instanceId,portId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeleteInstancePortMutationResult = NonNullable<Awaited<ReturnType<typeof deleteInstancePort>>>

    export type DeleteInstancePortMutationError = ErrorType<unknown>

    /**
 * @summary Remove a port rule
 */
export const useDeleteInstancePort = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteInstancePort>>, TError,{instanceId: string;portId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof deleteInstancePort>>,
        TError,
        {instanceId: string;portId: string},
        TContext
      > => {
      return useMutation(getDeleteInstancePortMutationOptions(options));
    }

export const getListTransactionsUrl = () => {




  return `/api/transactions`
}

/**
 * @summary List user's transactions
 */
export const listTransactions = async ( options?: RequestInit): Promise<Transaction[]> => {

  return customFetch<Transaction[]>(getListTransactionsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListTransactionsQueryKey = () => {
    return [
    `/api/transactions`
    ] as const;
    }


export const getListTransactionsQueryOptions = <TData = Awaited<ReturnType<typeof listTransactions>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listTransactions>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListTransactionsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listTransactions>>> = ({ signal }) => listTransactions({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listTransactions>>, TError, TData> & { queryKey: QueryKey }
}

export type ListTransactionsQueryResult = NonNullable<Awaited<ReturnType<typeof listTransactions>>>
export type ListTransactionsQueryError = ErrorType<unknown>


/**
 * @summary List user's transactions
 */

export function useListTransactions<TData = Awaited<ReturnType<typeof listTransactions>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listTransactions>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListTransactionsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getListTicketsUrl = () => {




  return `/api/support/tickets`
}

/**
 * @summary List user's support tickets
 */
export const listTickets = async ( options?: RequestInit): Promise<SupportTicket[]> => {

  return customFetch<SupportTicket[]>(getListTicketsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListTicketsQueryKey = () => {
    return [
    `/api/support/tickets`
    ] as const;
    }


export const getListTicketsQueryOptions = <TData = Awaited<ReturnType<typeof listTickets>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listTickets>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListTicketsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listTickets>>> = ({ signal }) => listTickets({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listTickets>>, TError, TData> & { queryKey: QueryKey }
}

export type ListTicketsQueryResult = NonNullable<Awaited<ReturnType<typeof listTickets>>>
export type ListTicketsQueryError = ErrorType<unknown>


/**
 * @summary List user's support tickets
 */

export function useListTickets<TData = Awaited<ReturnType<typeof listTickets>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listTickets>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListTicketsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCreateTicketUrl = () => {




  return `/api/support/tickets`
}

/**
 * @summary Create a support ticket
 */
export const createTicket = async (createTicketBody: CreateTicketBody, options?: RequestInit): Promise<SupportTicket> => {

  return customFetch<SupportTicket>(getCreateTicketUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      createTicketBody,)
  }
);}




export const getCreateTicketMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTicket>>, TError,{data: BodyType<CreateTicketBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createTicket>>, TError,{data: BodyType<CreateTicketBody>}, TContext> => {

const mutationKey = ['createTicket'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createTicket>>, {data: BodyType<CreateTicketBody>}> = (props) => {
          const {data} = props ?? {};

          return  createTicket(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateTicketMutationResult = NonNullable<Awaited<ReturnType<typeof createTicket>>>
    export type CreateTicketMutationBody = BodyType<CreateTicketBody>
    export type CreateTicketMutationError = ErrorType<unknown>

    /**
 * @summary Create a support ticket
 */
export const useCreateTicket = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTicket>>, TError,{data: BodyType<CreateTicketBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createTicket>>,
        TError,
        {data: BodyType<CreateTicketBody>},
        TContext
      > => {
      return useMutation(getCreateTicketMutationOptions(options));
    }

export const getGetTicketUrl = (ticketId: string,) => {




  return `/api/support/tickets/${ticketId}`
}

/**
 * @summary Get ticket details
 */
export const getTicket = async (ticketId: string, options?: RequestInit): Promise<SupportTicketDetail> => {

  return customFetch<SupportTicketDetail>(getGetTicketUrl(ticketId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetTicketQueryKey = (ticketId: string,) => {
    return [
    `/api/support/tickets/${ticketId}`
    ] as const;
    }


export const getGetTicketQueryOptions = <TData = Awaited<ReturnType<typeof getTicket>>, TError = ErrorType<unknown>>(ticketId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTicket>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTicketQueryKey(ticketId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTicket>>> = ({ signal }) => getTicket(ticketId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(ticketId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTicket>>, TError, TData> & { queryKey: QueryKey }
}

export type GetTicketQueryResult = NonNullable<Awaited<ReturnType<typeof getTicket>>>
export type GetTicketQueryError = ErrorType<unknown>


/**
 * @summary Get ticket details
 */

export function useGetTicket<TData = Awaited<ReturnType<typeof getTicket>>, TError = ErrorType<unknown>>(
 ticketId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTicket>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetTicketQueryOptions(ticketId,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getReplyToTicketUrl = (ticketId: string,) => {




  return `/api/support/tickets/${ticketId}/reply`
}

/**
 * @summary Reply to a support ticket
 */
export const replyToTicket = async (ticketId: string,
    replyTicketBody: ReplyTicketBody, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getReplyToTicketUrl(ticketId),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      replyTicketBody,)
  }
);}




export const getReplyToTicketMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof replyToTicket>>, TError,{ticketId: string;data: BodyType<ReplyTicketBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof replyToTicket>>, TError,{ticketId: string;data: BodyType<ReplyTicketBody>}, TContext> => {

const mutationKey = ['replyToTicket'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof replyToTicket>>, {ticketId: string;data: BodyType<ReplyTicketBody>}> = (props) => {
          const {ticketId,data} = props ?? {};

          return  replyToTicket(ticketId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ReplyToTicketMutationResult = NonNullable<Awaited<ReturnType<typeof replyToTicket>>>
    export type ReplyToTicketMutationBody = BodyType<ReplyTicketBody>
    export type ReplyToTicketMutationError = ErrorType<unknown>

    /**
 * @summary Reply to a support ticket
 */
export const useReplyToTicket = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof replyToTicket>>, TError,{ticketId: string;data: BodyType<ReplyTicketBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof replyToTicket>>,
        TError,
        {ticketId: string;data: BodyType<ReplyTicketBody>},
        TContext
      > => {
      return useMutation(getReplyToTicketMutationOptions(options));
    }

export const getGetAdminStatsUrl = () => {




  return `/api/admin/stats`
}

/**
 * @summary Get platform stats (admin only)
 */
export const getAdminStats = async ( options?: RequestInit): Promise<AdminStats> => {

  return customFetch<AdminStats>(getGetAdminStatsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetAdminStatsQueryKey = () => {
    return [
    `/api/admin/stats`
    ] as const;
    }


export const getGetAdminStatsQueryOptions = <TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAdminStatsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAdminStats>>> = ({ signal }) => getAdminStats({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData> & { queryKey: QueryKey }
}

export type GetAdminStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminStats>>>
export type GetAdminStatsQueryError = ErrorType<unknown>


/**
 * @summary Get platform stats (admin only)
 */

export function useGetAdminStats<TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetAdminStatsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getListAdminUsersUrl = () => {




  return `/api/admin/users`
}

/**
 * @summary List all users (admin only)
 */
export const listAdminUsers = async ( options?: RequestInit): Promise<AdminUser[]> => {

  return customFetch<AdminUser[]>(getListAdminUsersUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListAdminUsersQueryKey = () => {
    return [
    `/api/admin/users`
    ] as const;
    }


export const getListAdminUsersQueryOptions = <TData = Awaited<ReturnType<typeof listAdminUsers>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAdminUsers>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListAdminUsersQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listAdminUsers>>> = ({ signal }) => listAdminUsers({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listAdminUsers>>, TError, TData> & { queryKey: QueryKey }
}

export type ListAdminUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminUsers>>>
export type ListAdminUsersQueryError = ErrorType<unknown>


/**
 * @summary List all users (admin only)
 */

export function useListAdminUsers<TData = Awaited<ReturnType<typeof listAdminUsers>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAdminUsers>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListAdminUsersQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdjustUserWalletUrl = (userId: string,) => {




  return `/api/admin/users/${userId}/wallet`
}

/**
 * @summary Adjust a user's wallet balance (admin only)
 */
export const adjustUserWallet = async (userId: string,
    adjustWalletBody: AdjustWalletBody, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getAdjustUserWalletUrl(userId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      adjustWalletBody,)
  }
);}




export const getAdjustUserWalletMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adjustUserWallet>>, TError,{userId: string;data: BodyType<AdjustWalletBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adjustUserWallet>>, TError,{userId: string;data: BodyType<AdjustWalletBody>}, TContext> => {

const mutationKey = ['adjustUserWallet'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adjustUserWallet>>, {userId: string;data: BodyType<AdjustWalletBody>}> = (props) => {
          const {userId,data} = props ?? {};

          return  adjustUserWallet(userId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdjustUserWalletMutationResult = NonNullable<Awaited<ReturnType<typeof adjustUserWallet>>>
    export type AdjustUserWalletMutationBody = BodyType<AdjustWalletBody>
    export type AdjustUserWalletMutationError = ErrorType<unknown>

    /**
 * @summary Adjust a user's wallet balance (admin only)
 */
export const useAdjustUserWallet = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adjustUserWallet>>, TError,{userId: string;data: BodyType<AdjustWalletBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof adjustUserWallet>>,
        TError,
        {userId: string;data: BodyType<AdjustWalletBody>},
        TContext
      > => {
      return useMutation(getAdjustUserWalletMutationOptions(options));
    }

export const getListAdminInstancesUrl = () => {




  return `/api/admin/instances`
}

/**
 * @summary List all instances (admin only)
 */
export const listAdminInstances = async ( options?: RequestInit): Promise<AdminInstance[]> => {

  return customFetch<AdminInstance[]>(getListAdminInstancesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListAdminInstancesQueryKey = () => {
    return [
    `/api/admin/instances`
    ] as const;
    }


export const getListAdminInstancesQueryOptions = <TData = Awaited<ReturnType<typeof listAdminInstances>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAdminInstances>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListAdminInstancesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listAdminInstances>>> = ({ signal }) => listAdminInstances({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listAdminInstances>>, TError, TData> & { queryKey: QueryKey }
}

export type ListAdminInstancesQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminInstances>>>
export type ListAdminInstancesQueryError = ErrorType<unknown>


/**
 * @summary List all instances (admin only)
 */

export function useListAdminInstances<TData = Awaited<ReturnType<typeof listAdminInstances>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAdminInstances>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListAdminInstancesQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAssignInstanceUrl = (instanceId: string,) => {




  return `/api/admin/instances/${instanceId}/assign`
}

/**
 * @summary Assign credentials to a pending instance (admin only)
 */
export const assignInstance = async (instanceId: string,
    assignInstanceBody: AssignInstanceBody, options?: RequestInit): Promise<MessageResponse> => {

  return customFetch<MessageResponse>(getAssignInstanceUrl(instanceId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      assignInstanceBody,)
  }
);}




export const getAssignInstanceMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof assignInstance>>, TError,{instanceId: string;data: BodyType<AssignInstanceBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof assignInstance>>, TError,{instanceId: string;data: BodyType<AssignInstanceBody>}, TContext> => {

const mutationKey = ['assignInstance'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof assignInstance>>, {instanceId: string;data: BodyType<AssignInstanceBody>}> = (props) => {
          const {instanceId,data} = props ?? {};

          return  assignInstance(instanceId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AssignInstanceMutationResult = NonNullable<Awaited<ReturnType<typeof assignInstance>>>
    export type AssignInstanceMutationBody = BodyType<AssignInstanceBody>
    export type AssignInstanceMutationError = ErrorType<unknown>

    /**
 * @summary Assign credentials to a pending instance (admin only)
 */
export const useAssignInstance = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof assignInstance>>, TError,{instanceId: string;data: BodyType<AssignInstanceBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof assignInstance>>,
        TError,
        {instanceId: string;data: BodyType<AssignInstanceBody>},
        TContext
      > => {
      return useMutation(getAssignInstanceMutationOptions(options));
    }

export const getListAdminTicketsUrl = () => {




  return `/api/admin/tickets`
}

/**
 * @summary List all support tickets (admin only)
 */
export const listAdminTickets = async ( options?: RequestInit): Promise<SupportTicket[]> => {

  return customFetch<SupportTicket[]>(getListAdminTicketsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListAdminTicketsQueryKey = () => {
    return [
    `/api/admin/tickets`
    ] as const;
    }


export const getListAdminTicketsQueryOptions = <TData = Awaited<ReturnType<typeof listAdminTickets>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAdminTickets>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListAdminTicketsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listAdminTickets>>> = ({ signal }) => listAdminTickets({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listAdminTickets>>, TError, TData> & { queryKey: QueryKey }
}

export type ListAdminTicketsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminTickets>>>
export type ListAdminTicketsQueryError = ErrorType<unknown>


/**
 * @summary List all support tickets (admin only)
 */

export function useListAdminTickets<TData = Awaited<ReturnType<typeof listAdminTickets>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listAdminTickets>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListAdminTicketsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getListServerPoolUrl = () => {




  return `/api/admin/server-pool`
}

/**
 * @summary List server pool (admin only)
 */
export const listServerPool = async ( options?: RequestInit): Promise<ServerPoolEntry[]> => {

  return customFetch<ServerPoolEntry[]>(getListServerPoolUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListServerPoolQueryKey = () => {
    return [
    `/api/admin/server-pool`
    ] as const;
    }


export const getListServerPoolQueryOptions = <TData = Awaited<ReturnType<typeof listServerPool>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listServerPool>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListServerPoolQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listServerPool>>> = ({ signal }) => listServerPool({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listServerPool>>, TError, TData> & { queryKey: QueryKey }
}

export type ListServerPoolQueryResult = NonNullable<Awaited<ReturnType<typeof listServerPool>>>
export type ListServerPoolQueryError = ErrorType<unknown>


/**
 * @summary List server pool (admin only)
 */

export function useListServerPool<TData = Awaited<ReturnType<typeof listServerPool>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listServerPool>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListServerPoolQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAddServerToPoolUrl = () => {




  return `/api/admin/server-pool`
}

/**
 * @summary Add a server to the pool (admin only)
 */
export const addServerToPool = async (addServerPoolBody: AddServerPoolBody, options?: RequestInit): Promise<ServerPoolEntry> => {

  return customFetch<ServerPoolEntry>(getAddServerToPoolUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      addServerPoolBody,)
  }
);}




export const getAddServerToPoolMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addServerToPool>>, TError,{data: BodyType<AddServerPoolBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addServerToPool>>, TError,{data: BodyType<AddServerPoolBody>}, TContext> => {

const mutationKey = ['addServerToPool'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addServerToPool>>, {data: BodyType<AddServerPoolBody>}> = (props) => {
          const {data} = props ?? {};

          return  addServerToPool(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddServerToPoolMutationResult = NonNullable<Awaited<ReturnType<typeof addServerToPool>>>
    export type AddServerToPoolMutationBody = BodyType<AddServerPoolBody>
    export type AddServerToPoolMutationError = ErrorType<unknown>

    /**
 * @summary Add a server to the pool (admin only)
 */
export const useAddServerToPool = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addServerToPool>>, TError,{data: BodyType<AddServerPoolBody>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof addServerToPool>>,
        TError,
        {data: BodyType<AddServerPoolBody>},
        TContext
      > => {
      return useMutation(getAddServerToPoolMutationOptions(options));
    }

export const getListPlansUrl = () => {




  return `/api/plans`
}

/**
 * @summary List available VPS/RDP plans
 */
export const listPlans = async ( options?: RequestInit): Promise<Plan[]> => {

  return customFetch<Plan[]>(getListPlansUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListPlansQueryKey = () => {
    return [
    `/api/plans`
    ] as const;
    }


export const getListPlansQueryOptions = <TData = Awaited<ReturnType<typeof listPlans>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListPlansQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listPlans>>> = ({ signal }) => listPlans({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData> & { queryKey: QueryKey }
}

export type ListPlansQueryResult = NonNullable<Awaited<ReturnType<typeof listPlans>>>
export type ListPlansQueryError = ErrorType<unknown>


/**
 * @summary List available VPS/RDP plans
 */

export function useListPlans<TData = Awaited<ReturnType<typeof listPlans>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListPlansQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getGetDashboardSummaryUrl = () => {




  return `/api/dashboard/summary`
}

/**
 * @summary Get dashboard summary (instance counts, spending)
 */
export const getDashboardSummary = async ( options?: RequestInit): Promise<DashboardSummary> => {

  return customFetch<DashboardSummary>(getGetDashboardSummaryUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetDashboardSummaryQueryKey = () => {
    return [
    `/api/dashboard/summary`
    ] as const;
    }


export const getGetDashboardSummaryQueryOptions = <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetDashboardSummaryQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getDashboardSummary>>> = ({ signal }) => getDashboardSummary({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & { queryKey: QueryKey }
}

export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>
export type GetDashboardSummaryQueryError = ErrorType<unknown>


/**
 * @summary Get dashboard summary (instance counts, spending)
 */

export function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetDashboardSummaryQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







