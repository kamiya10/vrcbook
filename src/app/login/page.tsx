import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/ui/external-link';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/api';

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await login(values);

    if ('requiresTwoFactorAuth' in data) {
      void navigate(`/login/${data.requiresTwoFactorAuth[0]}`);
      return;
    }

    void navigate(`/`);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-card/80 shadow-md backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log into your VRChat account to start using VRCBook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => (void form.handleSubmit(onSubmit)(e))}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        type={field.value.includes('@') ? 'email' : 'username'}
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <span>Password</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="text-right text-sm">
                      Forgot your
                      {' '}
                      <ExternalLink href="https://vrchat.com/home/password">password</ExternalLink>
                      {' '}
                      or
                      {' '}
                      <ExternalLink href="https://vrchat.com/home/forgot-email">email address</ExternalLink>
                      ?
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="mt-4 text-center text-sm">
                New to VRChat?
                {' '}
                <ExternalLink href="https://vrchat.com/home/register">
                  Create an account
                </ExternalLink>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
