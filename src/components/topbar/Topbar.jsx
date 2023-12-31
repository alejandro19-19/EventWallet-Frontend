"use client";
import "./topbar.css";
import { IoMdSettings } from "react-icons/io";
import { BsBellFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { getNotifications } from "@/services/notifications";
import { profileGet } from "@/services/profile.fetch";
import NotificationCard from "../notificationCard/NotificationCard";
import Link from "next/link";
import ThemeToggle from "@/theme/ThemeToggle";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Loader from "../loader/Loader";

export function Topbar() {
  const [notifications, setNotifications] = useState(false);
  const [dataNotifications, setDataNotifications] = useState(null);
  const [countNotifications, setCountNotifications] = useState(0);
  const [user, setUser] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [changePage, setChangePage] = useState(false);
  const [exit, setExit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const data = await getNotifications();
      setDataNotifications(data);
      setCountNotifications(data.invitations.length);
      const profile = await profileGet();
      setDataUser(profile);
      setLoadingPage(false);
    }
    getData();
  }, [notifications, user]);

  function signOff() {
    setExit(true);
    deleteCookie("Token");
    router.push("/");
  }

  return (
    <div className="Topbar">
      <nav>
        {/* <button>
          <IoMdSettings />
        </button> */}
        <button
          onClick={() => {
            setUser(false);
            setNotifications(!notifications);
          }}
        >
          <BsBellFill />
          {countNotifications != 0 ? <p>{countNotifications}</p> : null}
        </button>
        <button
          onClick={() => {
            setNotifications(false);
            setUser(!user);
          }}
        >
          <CgProfile />
        </button>
      </nav>
      {notifications ? (
        <div className={"showNotifications"}>
          {dataNotifications != null &&
          dataNotifications.invitations.length != 0 ? (
            dataNotifications.invitations.map((item) => {
              if (!item.aceptado) {
                return (
                  <NotificationCard
                    key={item.evento.id}
                    title={item.evento.nombre}
                    description={item.evento.descripcion}
                  />
                );
              }
            })
          ) : (
            <div className="no-notifications">
              <p>No hay notificaciones</p>
            </div>
          )}
          <div className="button_all">
            <Link
              href="/application/events/notifications"
              className="all"
              onClick={() => {
                setChangePage(true);
              }}
            >
              {changePage ? <Loader /> : null}
              Ver todas mis notificaciones
            </Link>
          </div>
        </div>
      ) : null}
      {user ? (
        dataUser != null ? (
          <div className="showDataUser">
            <img src={dataUser.foto} alt="avatar" />
            <h1>{dataUser.nombre + " " + dataUser.apellidos}</h1>
            <h2>{dataUser.apodo}</h2>
            <div className="theme">
              <p>Cambiar tema</p>
              <ThemeToggle />
            </div>
            <div className="buttons">
              <Link
                href={"/application/profile"}
                onClick={() => {
                  setChangePage(true);
                }}
              >
                {changePage ? <Loader /> : null}
                Editar datos
              </Link>
              <button
                onClick={() => {
                  signOff();
                }}
                disabled={exit ? true : false}
              >
                {exit ? <Loader /> : null}
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <p>Sin datos</p>
        )
      ) : null}
    </div>
  );
}
