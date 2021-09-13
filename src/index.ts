import app from '@app';
const port: number = +process.env.PORT! || 3001;
const ENV: string = process.env.ENV!;

app.listen(port, () => {
    const serverType: string = ENV.charAt(0).toUpperCase() + ENV.substr(1).toLowerCase();
    console.log(`${serverType} server is running on port ${port}`);
});
