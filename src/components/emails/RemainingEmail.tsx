import type { PrismaClient } from '@prisma/client';

import { renderToString } from 'react-dom/server';

export const GetWinnerData = async (
  CompID: string,
  prismaClient: PrismaClient
) =>  await prismaClient.competition.findUnique({
    where: {
      id: CompID,
    },
    include: {
      Watches: {
        include: {
          images_url: true,
        },
      },
    },
  });

export const RemainingEmail = (data: ReturnType<typeof GetWinnerData> extends Promise<infer T>
  ? T extends Promise<infer U>
    ? U
    : T
  : never) => {
  console.log({
    order: data?.Order,
    competition: data?,
    watches: data?.Watches,
  });

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body style={{ width: '100%' }}>
        {/* Email header */}
        <div
          style={{
            maxWidth: '37.5em',
            margin: '0 auto',
            fontFamily: 'Kanit, sans-serif',
            textAlign: 'center',
            fontWeight: '500',
          }}
        >
          <div
            style={{
              backgroundColor: '#cbb9ac',
              padding: '20px',
            }}
          >
            <img
              alt="Logo"
              src="https://www.win-u-watch.uk/images/newLogo.png"
              width={200}
              height={100}
              style={{
                display: 'block',
                outline: 'none',
                alignSelf: 'center',
                border: 'none',
                textDecoration: 'none',
                margin: '0  auto',
                marginBottom: '20px',
              }}
            />
            <div
              style={{
                fontSize: '16px',
                margin: '5px 0px',
                textTransform: 'uppercase',
                color: '#fff',
                textAlign: 'center',
                fontWeight: '300',
                letterSpacing: '0.1rem',
              }}
            >
              <p style={{ margin: '0' }}>Dear {data?.Order?.first_name}</p>
              <p style={{ margin: '0' }}>we are reaching out to</p>
              <p style={{ margin: '0' }}>
                inform you about an exciting competition
              </p>
              <p style={{ margin: '0' }}>that may be of interest to you.</p>
            </div>
          </div>

          {/* Email Body */}

          <div
            style={{
              width: '100%',
            }}
          >
            <img
              alt={data?.Watches?.id}
              src={data?.Watches?.images_url[0]?.url}
              width="100%"
              height="500px"
              style={{
                display: 'block',
                outline: 'none',
                border: 'none',
                textDecoration: 'none',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                fontWeight: '300',
                backgroundColor: '#cbb9ac',
                padding: '20px',
                color: '#fff',
              }}
            >
              <h3
                style={{
                  textAlign: 'start',
                  fontWeight: '300',
                  fontSize: '24px',
                  textDecoration: 'underline',
                  textTransform: 'uppercase',
                }}
              >
                Watch information
              </h3>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Brand
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.brand}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Model
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.model}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Reference number
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.reference_number}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Movement
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.movement}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Year of manufacture
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.year_of_manifacture}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Caliber/Gear
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.caliber_grear}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Glass
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.glass}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Bezel material
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.bezel_material}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Bracelet material
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.Bracelet_material}
                  </p>
                </div>
              </div>
              <h3
                style={{
                  textAlign: 'start',
                  fontWeight: '300',
                  fontSize: '24px',
                  textDecoration: 'underline',
                  textTransform: 'uppercase',
                  marginTop: '4rem',
                }}
              >
                Competition details
              </h3>
              <div
                style={{
                  paddingBottom: '2rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Name
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.name}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: '4px',
                      minWidth: '180px',
                      textAlign: 'start',
                      fontStyle: 'italic',
                      fontWeight: '400',
                    }}
                  >
                    Prize
                  </p>
                  <p style={{ margin: '4px', textAlign: 'start' }}>
                    {data?.Watches?.brand}{' '}
                    {data?.Watches?.model}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Footer */}
          <div>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '24px',
                margin: '5px 0px',
                textTransform: 'uppercase',
                color: 'black',
                textAlign: 'center',
                letterSpacing: '0.05rem',
                padding: '20px',
                fontFamily: 'Kanit, sans-serif',
              }}
            >
              please make sure to follow us on instagram where we <br />
              host a live for each competition. <br /> we wish you the best of
              luck!
            </p>
            <a
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                margin: '0  auto',
              }}
              href="https://www.instagram.com/winuwatch/"
            >
              <img
                alt="instaFollow"
                src="https://www.win-u-watch.uk/images/InstaFooter.png"
                style={{ margin: '0  auto' }}
              />
            </a>
            <h4
              style={{
                width: '100%',
                textAlign: 'center',
                fontWeight: '400',
                background: 'lightgrey',
                fontFamily: 'Kanit, sans-serif',
              }}
            >
              Lisam Watch Ltd 63-66 Hatton Gardens, London, EC1N 8LE, UK
            </h4>
            <div style={{ display: 'flex' }}>
              <h5
                style={{
                  margin: '0',
                  fontWeight: '300',
                  marginRight: 'auto',
                  fontFamily: 'Kanit, sans-serif',
                }}
              >
                NO LONGER WANT TO RECEIVE THESE EMAILS? UNSUBSCRIBE
              </h5>
              <a
                style={{
                  textDecoration: 'none',
                  color: 'black',
                }}
                href="https://www.win-u-watch.uk/Privacy_Policy"
              >
                <h5
                  style={{
                    margin: '0',
                    fontWeight: '300',
                    fontFamily: 'Kanit, sans-serif',
                  }}
                >
                  PRIVACY POLICY
                </h5>
              </a>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default (order: Parameters<typeof RemainingEmail>[0]) =>
  renderToString(RemainingEmail(order));
