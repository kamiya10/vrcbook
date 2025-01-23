import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { verify2FA } from '@/lib/api';

const formSchema = z.object({
  code: z.string().min(6),
});

export default function TotpPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await verify2FA({
        type: 'totp',
        code: values.code,
      });

      if (data.verified) {
        void navigate('/');
        return;
      }

      throw new Error('Verification Failed');
    }
    catch (error) {
      if (!(error instanceof Error)) return;
      form.setError('code', { message: error.message });
      form.resetField('code', { keepError: true });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-card/80 shadow-md backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Two Factor Authentication</CardTitle>
          <CardDescription>
            Please Enter the 6-digit code from your Authentication App.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={(e) => (void form.handleSubmit(onSubmit)(e))}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        onComplete={() => field.value.length == 6 && formRef.current?.requestSubmit()}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => void navigate('/login')}
              >
                Back
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
