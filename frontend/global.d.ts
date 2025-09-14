// To support parcels bundle-text imports
declare module 'bundle-text:*' {
  const value: string
  export default value
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

